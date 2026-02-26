"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  change?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#adff00";
  if (score >= 50) return "#00f2ff";
  if (score >= 30) return "#ff00e5";
  return "#ff0044";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "BULLISH";
  if (score >= 50) return "NEUTRAL";
  if (score >= 30) return "CAUTIOUS";
  return "BEARISH";
}

export default function ScoreRing({ score, size = 200, strokeWidth = 6, change }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#ff00e5" />
            </linearGradient>
          </defs>
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 12px ${color}40)`,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-display neon-gradient font-black">{score}</span>
          <span className="font-tech text-[10px] tracking-[0.3em] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className={`font-tech text-[10px] tracking-[0.2em] ${change >= 0 ? "text-[#adff00]" : "text-[#ff00e5]"}`}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change)} PTS
          </span>
          <span className="font-tech text-[10px] tracking-[0.2em] text-white/30">VS LAST</span>
        </div>
      )}
    </div>
  );
}
