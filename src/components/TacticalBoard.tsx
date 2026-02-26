"use client";

// Simulates capital flow / token movement visualization
const markers = [
  { x: 15, y: 20, label: "ETH" },
  { x: 35, y: 45, label: "SOL" },
  { x: 55, y: 25, label: "BTC" },
  { x: 72, y: 60, label: "AERO" },
  { x: 25, y: 70, label: "PENDLE" },
  { x: 82, y: 35, label: "ARB" },
  { x: 48, y: 78, label: "BASE" },
];

const paths = [
  { x1: 15, y1: 20, x2: 35, y2: 45 },
  { x1: 35, y1: 45, x2: 55, y2: 25 },
  { x1: 55, y1: 25, x2: 72, y2: 60 },
  { x1: 25, y1: 70, x2: 48, y2: 78 },
  { x1: 82, y1: 35, x2: 72, y2: 60 },
];

export default function TacticalBoard() {
  return (
    <div className="card p-4">
      <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1] mb-3">CAPITAL FLOW MAP</h3>

      <div className="pitch-bg h-[200px] relative">
        {/* SVG paths */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {paths.map((p, i) => (
            <line
              key={i}
              x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
              stroke="#d4af37"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.5"
            />
          ))}
        </svg>

        {/* Markers */}
        {markers.map((m, i) => (
          <div
            key={i}
            className="absolute z-20 flex flex-col items-center gap-1"
            style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="pitch-marker" />
            <span className="font-data text-[7px] font-bold text-[#d4af37] tracking-wider">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1e293b]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
          <span className="font-data text-[8px] text-[#64748b]">TOKEN NODE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0 border-t border-dashed border-[#d4af37] opacity-50" />
          <span className="font-data text-[8px] text-[#64748b]">CAPITAL PATH</span>
        </div>
      </div>
    </div>
  );
}
