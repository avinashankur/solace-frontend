import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Video, Waves } from "lucide-react";
import VideoRecorder from "./VideoRecorder";

interface FeaturesProps {
  onChatClick: () => void;
}

export default function Features({ onChatClick }: FeaturesProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleKeyboardActivate = (
    e: React.KeyboardEvent<HTMLDivElement>,
    onActivate: () => void
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  if (isRecording) {
    return <VideoRecorder onClose={() => setIsRecording(false)} />;
  }

  return (
    <section aria-label="Wellness tools" className="my-10">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Tools
        </p>
        <h1 className="text-pretty text-2xl md:text-3xl font-semibold">
          Create, reflect, and find calm
        </h1>
        {/* <p className="text-muted-foreground mt-2 max-w-prose">
          Capture your thoughts with a quick vlog or take a mindful break with a
          guided meditation. Chat when you want a companion.
        </p> */}
      </div>

      {/* Primary actions as cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Record Vlog Card */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Record vlog"
          onClick={() => setIsRecording(true)}
          onKeyDown={(e) =>
            handleKeyboardActivate(e, () => setIsRecording(true))
          }
          className="group cursor-pointer relative overflow-hidden rounded-xl border-border border bg-secondary p-5 md:p-6 transition-all hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-border p-2 text-muted-foreground transition-colors group-hover:text-foreground">
              <Video className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Record Vlog</h2>
              <p className="text-sm text-muted-foreground">
                Share your experiences
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Start Meditation Card */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Start meditation"
          onClick={onChatClick}
          onKeyDown={(e) => handleKeyboardActivate(e, onChatClick)}
          className="group cursor-pointer relative overflow-hidden rounded-xl border-border border bg-secondary p-5 md:p-6 transition-all hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-border p-2 text-muted-foreground transition-colors group-hover:text-foreground">
              <Waves className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Start Meditation</h2>
              <p className="text-sm text-muted-foreground">
                Find your inner peace
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Chat Card */}
      <div className="rounded-xl border-border border bg-secondary p-5 md:p-6">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-border p-1.5 text-muted-foreground">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-medium">Chat with Maitri</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your companion is here when you need a thoughtful conversation.
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={onChatClick} className="gap-2">
              <span>Open chat</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              onClick={onChatClick}
              className="gap-2 bg-transparent"
            >
              <span>Quick prompt</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
