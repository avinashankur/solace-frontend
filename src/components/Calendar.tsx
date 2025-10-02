import { Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type CalendarProps = {
  completedDays?: number;
  days?: string[];
  nextReward?: string;
  className?: string;
};

const DEFAULT_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function Calendar({
  completedDays = 0,
  days = DEFAULT_DAYS,
  nextReward = "Keep it up to unlock your next reward",
  className,
}: CalendarProps) {
  const total = days.length;
  const clampedCompleted = Math.min(Math.max(completedDays, 0), total);
  const progress = Math.round((clampedCompleted / total) * 100);

  // Determine today's index using Monday as first day
  const jsDay = new Date().getDay(); // 0 = Sun ... 6 = Sat
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1; // convert to 0-based Monday start

  return (
    <section
      className={cn(
        "rounded-xl border border-border text-card-foreground p-5 bg-secondary",
        "flex flex-col gap-4",
        className
      )}
      aria-label="Weekly streak calendar"
    >
      {/* Streak header */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border border-border bg-muted/70 p-3"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground"
            )}
            aria-hidden="true"
          >
            <Flame className="size-5" />
          </span>
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground">Current streak</div>
            <div className="text-balance text-lg font-medium leading-tight">
              {clampedCompleted} {clampedCompleted === 1 ? "day" : "days"}
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{nextReward}</span>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Weekly streak progress"
          className="h-2 w-full rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="sr-only">{"Progress from 0% to 100%"}</span>
          <span>
            {clampedCompleted}/{total} completed
          </span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Week days */}
      <div
        className={cn("grid grid-cols-7 gap-3", "pt-1")}
        role="grid"
        aria-label="Days of the week"
      >
        {days.map((d, i) => {
          const isDone = i < clampedCompleted;
          const isToday = i === todayIndex;
          return (
            <div
              key={`${d}-${i}`}
              role="gridcell"
              aria-selected={isToday || undefined}
              className="flex flex-col items-center gap-2"
              title={isDone ? "Completed" : "Not completed"}
            >
              <span
                className={cn(
                  "text-xs tracking-wide uppercase",
                  "text-muted-foreground"
                )}
              >
                {d}
              </span>
              <div
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full border",
                  "transition-colors",
                  isDone
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground",
                  isToday &&
                    !isDone &&
                    "ring-2 ring-offset-2 ring-primary/30 ring-offset-background"
                )}
                aria-label={`${d} ${isDone ? "completed" : "not completed"}${
                  isToday ? " (today)" : ""
                }`}
              >
                {isDone ? (
                  <Check className="size-4" />
                ) : (
                  <span className="sr-only">Not completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Calendar;
