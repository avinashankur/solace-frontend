import type React from "react";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import VideoRecorder from "./VideoRecorder";
import MeditationTimer from "./MeditationTimer";

interface FeaturesProps {
  onChatClick: () => void;
}

export default function Features({ onChatClick: _onChatClick }: FeaturesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);

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
    return <VideoRecorder onClose={() => setIsRecording(false)}/>;
  }

  if (isMeditating) {
    return <MeditationTimer onClose={() => setIsMeditating(false)}/>;
  }

  return (
    <section aria-label="Wellness tools" className="relative space-y-5">
      {/* Record Vlog Card */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Record vlog"
        onClick={() => setIsRecording(true)}
        onKeyDown={(e) => handleKeyboardActivate(e, () => setIsRecording(true))}
        className="group cursor-pointer relative overflow-hidden rounded-xl shadow-custom-sh p-5 md:p-6 transition-all hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-lg p-2 text-muted-foreground transition-colors group-hover:text-foreground">
            <img src="/video.svg" alt="Camera" className="size-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Record Vlog</h2>
            <p className="text-sm text-muted-foreground">
              Share your daily experiences
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
        onClick={() => setIsMeditating(true)}
        onKeyDown={(e) => handleKeyboardActivate(e, () => setIsMeditating(true))}
        className="group cursor-pointer relative overflow-hidden rounded-xl shadow-custom-sh p-5 md:p-6 transition-all hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-lg p-2 text-muted-foreground transition-colors group-hover:text-foreground">
          <img src="/leaf.svg" alt="leaf" className="size-10" />
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
    </section>
  );
}
