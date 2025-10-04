import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CalendarProps = {
  completedDays?: number;
  days?: string[];
  className?: string;
};

const DEFAULT_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function Calendar({
  completedDays = 0,
  days = DEFAULT_DAYS,
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
        "rounded-xl text-card-foreground p-5 shadow-custom-sh bg-white",
        "flex flex-col gap-4",
        className
      )}
    >
      {/* Streak header */}
      <div className={cn("flex items-center justify-between")}>
        <div className="flex items-center gap-3">
          <img src="/flame.svg" alt="Flame" className="size-12" />
          <div className="text-balance text-tertiary text-lg font-medium leading-tight flex flex-col">
            {clampedCompleted}{" "}
            {clampedCompleted === 1 ? "day streak!" : "days streak!"}
            <span className="text-xs">Be ready to unlock Next hat!</span>
          </div>
        </div>
        <img src="/hat.svg" alt="Hat" className="size-20" />
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
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                className={cn("font-medium text-xs tracking-wide uppercase")}
              >
                {d}
              </span>
              <div
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full",
                  "transition-colors",
                  isDone
                    ? "bg-accent text-primary"
                    : "bg-muted text-muted-foreground",
                  isToday &&
                    !isDone &&
                    "ring-2 ring-offset-1 ring-primary/10 ring-offset-background"
                )}
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
