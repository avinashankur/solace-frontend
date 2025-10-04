"use client";

import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpIcon, X, Trash2, BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/time";

type Message = {
  id: string;
  text: string;
  role: "assistant" | "user" | "system";
  timestamp?: number;
};

type ChatBotProps = {
  onClose?: () => void;
  title?: string;
  intro?: string;
  apiUrl?: string; // POST endpoint that returns { message: string }
  userId?: string;
  className?: string;
};

// localStorage utilities
const getStorageKey = (userId: string) => `chatbot-messages-${userId}`;

const saveMessages = (userId: string, messages: Message[]) => {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(messages));
  } catch (error) {
    console.warn("Failed to save messages to localStorage:", error);
  }
};

const loadMessages = (userId: string, fallback: Message[]): Message[] => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    if (stored) {
      const parsed = JSON.parse(stored) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Failed to load messages from localStorage:", error);
  }
  return fallback;
};

const clearMessages = (userId: string) => {
  try {
    localStorage.removeItem(getStorageKey(userId));
  } catch (error) {
    console.warn("Failed to clear messages from localStorage:", error);
  }
};

export default function ChatBot({
  onClose,
  title = "Assistant",
  intro = "👋 Hi there! How can I help?",
  apiUrl = "/api/chat/message",
  userId = "anonymous",
  className,
}: ChatBotProps) {
  const initialMessages: Message[] = [
    { id: "m-0", text: intro, role: "assistant", timestamp: Date.now() },
  ];
  const [messages, setMessages] = useState<Message[]>(() =>
    loadMessages(userId, initialMessages)
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  // persist messages
  useEffect(() => {
    saveMessages(userId, messages);
  }, [messages, userId]);

  // keep view pinned to latest message
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, loading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function handleSend() {
    if (!canSend) return;
    const userText = input.trim();
    setInput("");
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: userText,
      role: "user",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: userText }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data: { message?: string } = await res.json();
      const reply = data?.message || "I'm sorry, I couldn't parse a response.";
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          text: reply,
          role: "assistant",
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error("[v0] Chat send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          text: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void handleSend();
  }

  function handleClearChat() {
    clearMessages(userId);
    setMessages(initialMessages);
  }

  return (
    <section
      className={cn(
        "absolute inset-0 w-full rounded-xl text-card-foreground",
        "outline-none",
        className
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-3 border-b border-border bg-secondary">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background"
          >
            <BotIcon className="h-4 w-4 text-muted-foreground" />
          </span>
          <h2 className="text-sm font-medium leading-none">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Clear chat history"
            onClick={handleClearChat}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Close chat"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="h-[370px] bg-white">
        <div
          ref={listRef}
          className="p-3 flex flex-col gap-3"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((m) => {
            const isUser = m.role === "user";
            const timestamp = m.timestamp
              ? formatRelativeTime(m.timestamp)
              : null;

            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1",
                  isUser ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "flex items-end gap-2 w-full",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!isUser && (
                    <span
                      aria-hidden
                      className="bg-secondary rounded-full size-8 flex items-center justify-center shrink-0"
                    >
                      <BotIcon size={15} />
                    </span>
                  )}

                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl p-3 text-sm transition-colors",
                      isUser
                        ? "bg-tertiary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                </div>

                {timestamp && (
                  <div
                    className={cn(
                      "text-xs text-muted-foreground px-1",
                      isUser ? "text-right" : "text-left"
                    )}
                  >
                    {timestamp}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-muted text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="sr-only">Maitri is thinking</span>
                  <span className="flex gap-1" aria-hidden>
                    <i className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                    <i className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:120ms]" />
                    <i className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:240ms]" />
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex items-center gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <Input
            id="chat-input"
            placeholder="Hi Maitri, how are you?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="bg-secondary p-6 border-none rounded-3xl"
          />
          <Button
            type="submit"
            disabled={!canSend}
            variant="default"
            className="shrink-0 rounded-2xl py-5 bg-accent"
            aria-label="Send message"
          >
            <ArrowUpIcon />
          </Button>
        </div>
      </form>
    </section>
  );
}
