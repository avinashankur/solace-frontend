"use client";

import * as React from "react";

type CircularTimerRingProps = {
  progress?: number;
  totalSeconds?: number;
  secondsRemaining?: number;
  centerText?: string;

  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  colorFrom?: string;
  colorTo?: string;
  roundedCaps?: boolean;
  glow?: boolean;
  className?: string;
  ariaLabel?: string;

  ringPadding?: number;
  outerBorderWidth?: number;
  outerBorderColor?: string;
  outerBorderGap?: number;
  innerBorderWidth?: number;
  innerBorderColor?: string;
  innerBorderGap?: number;
};

export default function CircularTimerRing({
  progress,
  totalSeconds,
  secondsRemaining,
  centerText,
  size = 220,
  strokeWidth = 16,
  trackColor = "hsl(var(--foreground) / 0.08)",
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--primary) / 0.85)",
  roundedCaps = true,
  glow = false,
  className,
  ariaLabel,
  ringPadding = 10,
  outerBorderWidth = 8,
  outerBorderColor = "hsl(var(--foreground) / 0.06)",
  outerBorderGap = 4,
  innerBorderWidth = 6,
  innerBorderColor = "hsl(var(--foreground) / 0.06)",
  innerBorderGap = 4,
}: CircularTimerRingProps) {
  const id = React.useId();
  const gradId = `ring-grad-${id}`;
  const glowId = `ring-glow-${id}`;

  const deriveProgress = () => {
    if (typeof progress === "number") return progress;
    if (
      typeof totalSeconds === "number" &&
      typeof secondsRemaining === "number" &&
      totalSeconds > 0
    ) {
      return secondsRemaining / totalSeconds;
    }
    return 0;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const clamped = Math.max(0, Math.min(1, deriveProgress()));
  const center = size / 2;
  const radius = center - strokeWidth / 2 - ringPadding;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  const outerR = Math.min(
    center - outerBorderWidth / 2,
    radius + strokeWidth / 2 + outerBorderGap
  );
  const innerR = Math.max(0, radius - strokeWidth / 2 - innerBorderGap);

  const label =
    centerText ??
    (typeof secondsRemaining === "number"
      ? formatTime(Math.max(0, secondsRemaining))
      : undefined);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={
        ariaLabel ?? `Timer progress ${Math.round(clamped * 100)} percent`
      }
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>

        <filter
          id={glowId}
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
        </filter>
      </defs>

      {outerBorderWidth > 0 && outerR > 0 && (
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke={outerBorderColor}
          strokeWidth={outerBorderWidth}
        />
      )}
      {innerBorderWidth > 0 && innerR > 0 && (
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke={innerBorderColor}
          strokeWidth={innerBorderWidth}
        />
      )}

      {/* track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        style={{ opacity: 1 }}
      />

      {/* progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap={roundedCaps ? "round" : "butt"}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${center} ${center})`}
        filter={glow ? `url(#${glowId})` : undefined}
        style={{ transition: "stroke-dashoffset 300ms ease" }}
      />

      {/* centered time */}
      {label && (
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight={700}
          fontSize={Math.round(size * 0.18)}
          fill="hsl(var(--primary))"
          style={{ fontFamily: "var(--font-sans)" }}
          aria-hidden="true"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
