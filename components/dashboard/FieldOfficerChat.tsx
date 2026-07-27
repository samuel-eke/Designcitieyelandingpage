"use client";

import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X } from "lucide-react";
import { ChatMessage } from "./types";

interface FieldOfficerChatProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  chatMessages: ChatMessage[];
  officerTyping: boolean;
  handleSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null> | React.RefObject<HTMLDivElement> | any;
}

export function FieldOfficerChat({
  chatOpen,
  setChatOpen,
  chatInput,
  setChatInput,
  chatMessages,
  officerTyping,
  handleSendMessage,
  messagesEndRef,
}: FieldOfficerChatProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-[90vw] sm:w-[380px] h-[450px] bg-white border border-stone-200 rounded-3xl shadow-xl shadow-stone-300/40 mb-4 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Photo or Initials */}
                <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center border-2 border-white/30 text-xs">
                  AB
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold leading-tight">Officer Aisha Bello</h4>
                  <span className="text-[9px] font-bold text-green-300 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                    Assigned Field Officer
                  </span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === "citizen" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed text-left ${
                      msg.sender === "citizen"
                        ? "bg-green-700 text-white rounded-tr-none"
                        : "bg-white border border-stone-200 text-stone-850 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-stone-400 mt-1 font-mono">{msg.time}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {officerTyping && (
                <div className="flex flex-col items-start mr-auto max-w-[80%]">
                  <div className="p-3 bg-white border border-stone-200 text-stone-500 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Officer Aisha a question..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:border-green-600 outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-green-700 hover:bg-green-800 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Toggle Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg shadow-green-900/20 font-bold text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageSquare className="w-4 h-4 text-yellow-400" />
        <span>Chat Officer Aisha</span>
      </button>
    </div>
  );
}
