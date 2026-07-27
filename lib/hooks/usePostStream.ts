/**
 * usePostStream — SSE subscription hook (secure variant)
 *
 * Connects to the Next.js SSE proxy route at /api/posts/stream using a
 * streaming fetch() call with an Authorization: Bearer header.
 *
 * WHY fetch() INSTEAD OF EventSource:
 * ─────────────────────────────────────
 * The native EventSource API does not support custom request headers.
 * Passing the JWT as a query param (?token=...) is insecure — it appears
 * in server access logs, browser history, and Referer headers.
 *
 * Instead we use fetch() with a ReadableStream reader to manually parse
 * Server-Sent Events from the response body. This gives us full control
 * over headers while keeping the wire format identical to EventSource.
 *
 * SECURITY:
 * - JWT travels in the Authorization header only (never in a URL)
 * - Proxy route (app/api/posts/stream/route.ts) relays header server-to-server
 * - On 401 from the proxy, the existing apiClient interceptor will silent-refresh
 *   and the hook will reconnect
 */

"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import type { PostDto } from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// SSE text frame parser — converts raw SSE lines into structured events
// ---------------------------------------------------------------------------

interface SseFrame {
  event: string | null;
  data: string | null;
}

/**
 * Parses a block of SSE lines (separated by blank lines) into frames.
 * Handles multi-line `data:` fields by concatenating with newlines.
 */
function parseSseChunk(chunk: string): SseFrame[] {
  const frames: SseFrame[] = [];
  // SSE messages are separated by double newlines
  const messages = chunk.split(/\n\n+/);

  for (const message of messages) {
    const lines = message.split(/\n/);
    let event: string | null = null;
    const dataParts: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataParts.push(line.slice(5).trim());
      }
    }

    if (dataParts.length > 0) {
      frames.push({ event, data: dataParts.join("\n") });
    }
  }

  return frames;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UsePostStreamOptions {
  /**
   * Called for each `new-post` event. Receives a PostDto derived from the
   * PostPublishedEvent the server dispatches after an admin publishes a post.
   */
  onNewPost: (post: PostDto) => void;
}

interface UsePostStreamResult {
  /** True when the SSE stream is open and the server handshake was received */
  isConnected: boolean;
  /** Non-null when the connection cannot be established or was lost */
  connectionError: string | null;
  /** Manually reconnect (e.g. after a token refresh) */
  reconnect: () => void;
}

export function usePostStream({ onNewPost }: UsePostStreamOptions): UsePostStreamResult {
  const accessToken = useAuthStore((s) => s.accessToken);

  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectCountRef = useRef(0);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    // Cancel any existing connection before opening a new one
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!accessToken) {
      setConnectionError("No access token — cannot subscribe to post stream.");
      return;
    }

    setConnectionError(null);

    try {
      const response = await fetch("/api/posts/stream", {
        method: "GET",
        headers: {
          // JWT travels only in this header — never in the URL
          Authorization: `Bearer ${accessToken}`,
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unknown error");
        throw new Error(`SSE proxy returned ${response.status}: ${errText}`);
      }

      if (!response.body) {
        throw new Error("SSE response has no body.");
      }

      // Stream opened successfully
      setIsConnected(true);
      reconnectCountRef.current = 0;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Read loop — processes chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE messages are delimited by blank lines (\n\n)
        const boundary = buffer.lastIndexOf("\n\n");
        if (boundary === -1) continue;

        const completeChunk = buffer.slice(0, boundary + 2);
        buffer = buffer.slice(boundary + 2);

        const frames = parseSseChunk(completeChunk);
        for (const frame of frames) {
          if (frame.event === "handshake") {
            // Server confirmed the connection — already marked connected above
            continue;
          }

          if (frame.event === "new-post" && frame.data) {
            try {
              const post = JSON.parse(frame.data) as PostDto;
              onNewPost(post);
            } catch {
              console.warn("[usePostStream] Could not parse new-post event:", frame.data);
            }
          }
        }
      }

      // Stream ended cleanly — mark as disconnected and schedule reconnect
      setIsConnected(false);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        // Intentional abort (component unmount or manual reconnect) — do nothing
        return;
      }

      setIsConnected(false);
      const message = err instanceof Error ? err.message : "SSE connection failed.";
      setConnectionError(message);
      console.error("[usePostStream] Connection error:", message);

      // Exponential backoff reconnect (max 30 s)
      reconnectCountRef.current += 1;
      const delay = Math.min(1000 * 2 ** reconnectCountRef.current, 30_000);
      setTimeout(() => {
        if (!controller.signal.aborted) {
          connect();
        }
      }, delay);
    }
  }, [accessToken, onNewPost]); // eslint-disable-line react-hooks/exhaustive-deps

  // Open connection when token is available; close on unmount
  useEffect(() => {
    if (!accessToken) return;
    connect();
    return () => {
      abortControllerRef.current?.abort();
      setIsConnected(false);
    };
  }, [accessToken, connect]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isConnected,
    connectionError,
    reconnect: connect,
  };
}


