"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  change?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#d4af37";
  if (score >= 50) return "#06b6d4";
  if (score >= 30) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "BULLISH";
  if (score >= 50) return "NEUTRAL";
  if (score >= 30) return "CAUTIOUS";
  return "BEARISH";
}

export default function ScoreRing({ score, size = 140, strokeWidth = 4, change }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="square"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${color}50)`, transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-data text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="font-heading text-[8px] tracking-[0.3em] text-[#64748b] mt-0.5">{getScoreLabel(score)}</span>
        </div>
      </div>
      {change !== undefined && (
        <span className={`font-data text-[9px] font-bold ${change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change)} PTS
        </span>
      )}
    </div>
  );
}
