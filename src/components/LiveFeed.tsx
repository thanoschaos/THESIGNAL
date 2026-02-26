"use client";

import { LiveEvent } from "@/lib/mock-data";

const typeColors = {
  bullish: { bg: "bg-[#00ff8815]", border: "border-[#00ff8830]", dot: "bg-[#00ff88]" },
  bearish: { bg: "bg-[#ff446615]", border: "border-[#ff446630]", dot: "bg-[#ff4466]" },
  neutral: { bg: "bg-[#ffaa0015]", border: "border-[#ffaa0030]", dot: "bg-[#ffaa00]" },
};

export default function LiveFeed({ events }: { events: LiveEvent[] }) {
  return (
    <div className="signal-card rounded-xl bg-[#16161f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📡</span>
          <h3 className="font-semibold text-[#e8e8ed]">Live Analysis Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] live-dot" />
          <span className="text-xs text-[#00ff88] font-medium">LIVE</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {events.map((event) => {
          const colors = typeColors[event.type];
          return (
            <div
              key={event.id}
              className={`${colors.bg} border ${colors.border} rounded-lg p-3`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                <span className="text-xs text-[#8888a0]">{event.timestamp}</span>
                <span className="text-xs text-[#8888a0]">•</span>
                <span className="text-xs text-[#8888a0]">{event.category}</span>
              </div>
              <p className="text-sm text-[#e8e8ed] leading-relaxed">{event.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
