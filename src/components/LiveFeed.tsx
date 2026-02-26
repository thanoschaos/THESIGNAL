"use client";

import { LiveEvent } from "@/lib/mock-data";

const typeStyles = {
  bullish: { border: "border-[#adff00]/20", dot: "bg-[#adff00]", label: "text-[#adff00]" },
  bearish: { border: "border-[#ff00e5]/20", dot: "bg-[#ff00e5]", label: "text-[#ff00e5]" },
  neutral: { border: "border-[#00f2ff]/20", dot: "bg-[#00f2ff]", label: "text-[#00f2ff]" },
};

export default function LiveFeed({ events }: { events: LiveEvent[] }) {
  return (
    <div className="glass rounded-lg p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-tech text-[11px] tracking-[0.2em] text-white/90">LIVE ANALYSIS</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#adff00] pulse-live" />
          <span className="font-tech text-[9px] tracking-[0.3em] text-[#adff00]">LIVE</span>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
        {events.map((event) => {
          const styles = typeStyles[event.type];
          return (
            <div
              key={event.id}
              className={`glass border ${styles.border} rounded-md p-3 group/event`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-1 h-1 rounded-full ${styles.dot}`} />
                <span className="font-tech text-[9px] tracking-[0.15em] text-white/30">{event.timestamp}</span>
                <span className="text-white/10">·</span>
                <span className={`font-tech text-[8px] tracking-[0.15em] ${styles.label}`}>{event.category.toUpperCase()}</span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-mono group-hover/event:text-white/80 transition-colors">
                {event.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
