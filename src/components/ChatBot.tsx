import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ArrowUpIcon, Bot, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  text: string
  role: "assistant" | "user" | "system"
}

type ChatBotProps = {
  onClose?: () => void
  title?: string
  intro?: string
  apiUrl?: string // POST endpoint that returns { message: string }
  userId?: string
  className?: string
}

export function ChatBot({
  onClose,
  title = "Assistant",
  intro = "Hi! How can I help you today?",
  apiUrl = "/api/chat/message",
  userId = "anonymous",
  className,
}: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>(() => [{ id: "m-0", text: intro, role: "assistant" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // Smoothly keep the view pinned to the latest message
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, loading])

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  async function handleSend() {
    if (!canSend) return
    const userText = input.trim()
    setInput("")
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: userText,
      role: "user",
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: userText }),
      })

      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      const data: { message?: string } = await res.json()
      const reply = data?.message || "I’m sorry, I couldn’t parse a response."
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, text: reply, role: "assistant" }])
    } catch (err) {
      console.error("[v0] Chat send error:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          text: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void handleSend()
  }

  return (
    <section
      className={cn(
        "fixed bottom-4 right-4 w-full md:w-[420px] rounded-xl border border-border bg-card text-card-foreground shadow-lg",
        "outline-none",
        className,
      )}
      aria-label="Chat assistant"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background">
            <Bot className="h-4 w-4 text-muted-foreground" />
          </span>
          <h2 className="text-sm font-medium leading-none">{title}</h2>
        </div>
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
      </header>

      {/* Messages */}
      <ScrollArea className="h-[400px]" ref={scrollRef}>
        <div ref={listRef} className="p-3 flex flex-col gap-3" role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((m) => {
            const isUser = m.role === "user"
            return (
              <div key={m.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    "transition-colors",
                    isUser ? "bg-background border border-border text-foreground" : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            )
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-muted text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="sr-only">Assistant is typing</span>
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

      <Separator className="bg-border" />

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex items-center gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <Input
            id="chat-input"
            placeholder="Help me solve this problem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="bg-background"
          />
          <Button type="submit" disabled={!canSend} variant="default" className="shrink-0" aria-label="Send message">
            <ArrowUpIcon />
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ChatBot;
