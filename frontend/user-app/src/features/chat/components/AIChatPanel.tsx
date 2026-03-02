import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageSquare, Send, Sparkles, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../core/api";

const AIChatPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: 'Hello! I am your WeTap AI assistant. How can I help you today? E.g., "Split a bill", "Send money to Jane", "Buy airtime".',
    },
  ]);
  const [input, setInput] = useState("");

  // Deep linking logic
  useEffect(() => {
    if (
      location.pathname.includes("/app/chat") ||
      location.search.includes("chat=open")
    ) {
      setIsOpen(true);
      if (location.pathname.includes("/app/chat")) {
        navigate("/app/home", { replace: true });
      }
    }
  }, [location.pathname, location.search, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const chatMutation = useMutation({
    mutationFn: api.chat.send,
    onSuccess: (data: any) => {
      setMessages((prev) => [...prev, { role: data.role, text: data.text }]);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    chatMutation.mutate(userText);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 z-40 transition-transform active:scale-95 group"
      >
        <MessageSquare className="group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.9,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[340px] md:w-[400px] h-[550px] max-h-[75vh] z-50 glass-panel flex flex-col overflow-hidden shadow-2xl border border-[var(--color-border)]"
          >
            {/* Chat Header */}
            <div className="p-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-brand-primary/20 p-2 rounded-xl text-brand-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold leading-tight">WeTap AI</h3>
                  <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
                    Smart Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors relative z-10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-[var(--color-bg-primary)]/50 backdrop-blur-md">
              <div className="text-center text-xs text-[var(--color-text-tertiary)] my-2">
                Today,{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-brand-primary text-white rounded-2xl rounded-tr-sm"
                        : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {chatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm p-4 text-[var(--color-text-tertiary)] flex gap-1 items-center shadow-sm">
                    <span
                      className="w-2 h-2 rounded-full bg-brand-primary/50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-brand-primary/60 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-brand-primary/70 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] flex gap-2 relative z-10"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to do anything..."
                disabled={chatMutation.isPending}
                className="flex-1 bg-[var(--color-bg-primary)] px-4 py-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-brand-primary text-sm shadow-inner disabled:opacity-50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || chatMutation.isPending}
                className="w-12 h-12 rounded-xl bg-brand-primary hover:bg-brand-primary-hover flex items-center justify-center text-white disabled:opacity-50 shrink-0 shadow-lg shadow-blue-500/20 transition-colors"
              >
                {chatMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} className="translate-x-0.5" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatPanel;
