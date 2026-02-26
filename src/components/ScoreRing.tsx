"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  change?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#00ff88";
  if (score >= 50) return "#ffaa00";
  if (score >= 30) return "#ff8844";
  return "#ff4466";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Bullish";
  if (score >= 50) return "Neutral";
  if (score >= 30) return "Cautious";
  return "Bearish";
}

export default function ScoreRing({ score, size = 200, strokeWidth = 8, label, change }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2a2a3a"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-sm text-[#8888a0]">{getScoreLabel(score)}</span>
        </div>
      </div>
      {label && <span className="text-sm text-[#8888a0]">{label}</span>}
      {change !== undefined && (
        <span className={`text-sm font-medium ${change >= 0 ? "text-[#00ff88]" : "text-[#ff4466]"}`}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)} pts
        </span>
      )}
    </div>
  );
}
