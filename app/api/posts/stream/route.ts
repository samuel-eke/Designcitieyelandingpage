/**
 * Next.js API Route — Server-side SSE Proxy for CitiEye Post Stream
 *
 * Route: GET /api/posts/stream
 *
 * SECURITY DESIGN:
 * ─────────────────────────────────────────────────────────────────
 * The browser connects to THIS Next.js route with a standard
 * `Authorization: Bearer <token>` header. The route then opens a
 * server-to-server fetch to the Spring Boot SSE endpoint, forwarding
 * that same header. The JWT is NEVER exposed in any URL — it only
 * travels in HTTP headers, which are not logged by proxies or browsers.
 *
 * ─────────────────────────────────────────────────────────────────
 * Flow:
 *   Browser (fetch with header)
 *     → Next.js /api/posts/stream  (this file)
 *       → Spring Boot /api/posts/stream (Authorization: Bearer forwarded)
 *         → streams text/event-stream back
 *       ← streams back to browser as text/event-stream
 *     ← Browser reads events
 */

import { NextRequest } from "next/server";

// The CitiEye Spring Boot server URL — server-only env var (not NEXT_PUBLIC)
// Using 127.0.0.1 explicitly to avoid Node 18+ IPv6 (::1) lookup ECONNREFUSED errors
const CITIEYE_SERVER = (process.env.SERVER_URL || "http://127.0.0.1:8080").replace("localhost", "127.0.0.1");

export async function GET(req: NextRequest) {
  // 1. Extract the Authorization header the browser sent
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Authorization header." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Open a server-side fetch to the Spring Boot SSE endpoint.
  //    The JWT travels only in an HTTP header — not in the URL.
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${CITIEYE_SERVER}/api/posts/stream`, {
      method: "GET",
      headers: {
        Authorization: authHeader,           // forward the Bearer token
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      // Node.js fetch: disable response body auto-consumption so we can stream it
      // @ts-expect-error — `duplex` is required for streaming in Node 18+
      duplex: "half",
    });
  } catch (err) {
    console.error("[SSE Proxy] Failed to connect to CitiEye server:", err);
    return new Response(
      JSON.stringify({ error: "Unable to reach the CitiEye server." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!upstreamResponse.ok) {
    // Spring Boot returned an error (e.g. 401 for expired token)
    const errorBody = await upstreamResponse.text();
    return new Response(errorBody, {
      status: upstreamResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!upstreamResponse.body) {
    return new Response(
      JSON.stringify({ error: "Upstream returned no body." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Pipe the upstream SSE stream back to the browser through a fault-tolerant
  //    TransformStream. When Spring Boot closes the socket (natural timeout,
  //    heartbeat failure, or server restart) the ReadableStream throws an
  //    UND_ERR_SOCKET / ECONNRESET error. We catch that inside the transform so
  //    Next.js receives a clean stream-end rather than an unhandled rejection that
  //    it logs as "failed to pipe response" / 500.
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Async pump — runs in background, does NOT block the Response constructor.
  (async () => {
    const reader = upstreamResponse.body!.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(value);
      }
    } catch {
      // Upstream socket closed (ECONNRESET, UND_ERR_SOCKET, etc.).
      // This is normal when Spring Boot ends the SSE connection.
      // Silently end the stream — the browser hook will reconnect.
    } finally {
      writer.close().catch(() => {});
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Allow the browser to read the Authorization header in the preflight
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no", // Tell Nginx not to buffer this response
    },
  });
}
