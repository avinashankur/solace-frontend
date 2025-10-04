import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Plus } from "lucide-react";
import CircularTimerRing from "./circular-timer-ring";

interface MeditationTimerProps {
  onClose: () => void;
}

const MeditationTimer = ({ onClose }: MeditationTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setTimeLeft(10 * 60);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleAddMinute = () => {
    setTimeLeft((prev) => prev + 60);
  };

  const isTimerComplete = timeLeft === 0;

  return (
    <div className="absolute top-0 left-0 w-full z-20 bg-white rounded-xl">
      <div className="flex items-center gap-2 bg-secondary p-4 rounded-t-lg">
        <ArrowLeft className="w-4 h-4 cursor-pointer" onClick={onClose} />
        <p className="text-sm font-medium">Meditation Timer</p>
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="text-center mb-8 ">
          <CircularTimerRing
            progress={timeLeft / (10 * 60)}
            totalSeconds={10 * 60}
            secondsRemaining={timeLeft}
            size={240}
            strokeWidth={14}
            trackColor="hsl(var(--foreground) / 0.08)"
            colorFrom="hsl(252 92% 62%)"
            colorTo="hsl(252 76% 50%)"
            outerBorderWidth={1}
            outerBorderColor="#e8e8e8"
            outerBorderGap={6}
            innerBorderWidth={1}
            innerBorderColor="#e8e8e8"
            innerBorderGap={6}
          />
          {isTimerComplete && (
            <p className="text-lg text-green-600 font-medium">
              🧘‍♀️ Meditation Complete! Well done!
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleRestart}
            variant="outline"
            size="lg"
            className="rounded-full size-12 border-border bg-secondary hover:bg-secondary/80 p-0"
            title="Restart timer"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          <Button
            onClick={handlePause}
            size="lg"
            className={`rounded-2xl  w-32 h-12 p-0 ${
              isPaused
                ? "bg-green-500 hover:bg-green-600"
                : "bg-accent hover:bg-accent/90"
            }`}
            title={isPaused ? "Resume meditation" : "Pause meditation"}
          >
            {isPaused ? (
              <Play className="w-8 h-8" fill="currentColor" />
            ) : (
              <Pause className="w-8 h-8" fill="currentColor" />
            )}
          </Button>

          <Button
            onClick={handleAddMinute}
            variant="outline"
            size="lg"
            className="rounded-full border-border bg-secondary hover:bg-secondary/80 size-12 p-0"
            title="Add 1 minute"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {isTimerComplete
              ? "Take a moment to appreciate your mindfulness practice"
              : isPaused
              ? "Meditation paused - take your time"
              : "Focus on your breath and find your center"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeditationTimer;
