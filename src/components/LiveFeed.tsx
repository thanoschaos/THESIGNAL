"use client";

import { LiveEvent } from "@/lib/mock-data";

const typeConfig = {
  bullish: { border: "border-l-[#22c55e]", dot: "bg-[#22c55e]", tag: "text-[#22c55e]" },
  bearish: { border: "border-l-[#ef4444]", dot: "bg-[#ef4444]", tag: "text-[#ef4444]" },
  neutral: { border: "border-l-[#06b6d4]", dot: "bg-[#06b6d4]", tag: "text-[#06b6d4]" },
};

export default function LiveFeed({ events }: { events: LiveEvent[] }) {
  return (
    <div className="card p-4 sticky top-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
        <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1]">LIVE ANALYSIS FEED</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e] status-live" />
          <span className="font-data text-[8px] font-bold text-[#22c55e] tracking-[0.2em]">LIVE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {events.map((event) => {
          const cfg = typeConfig[event.type];
          return (
            <div key={event.id} className={`bg-[#050a14] border-l-2 ${cfg.border} border-r border-t border-b border-r-[#1e293b] border-t-[#1e293b] border-b-[#1e293b] p-3 rounded-[1px]`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                <span className="font-data text-[8px] text-[#64748b] font-medium">{event.timestamp}</span>
                <span className="text-[#1e293b]">|</span>
                <span className={`font-heading text-[7px] tracking-[0.15em] ${cfg.tag}`}>{event.category.toUpperCase()}</span>
              </div>
              <p className="font-ui text-[10px] text-[#94a3b8] leading-relaxed">{event.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
