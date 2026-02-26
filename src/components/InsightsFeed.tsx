"use client";

interface Event {
  id: string;
  timestamp: string;
  type: "bullish" | "bearish" | "neutral";
  message: string;
  category: string;
}

const typeConfig = {
  bullish: { dot: "bg-[#34d399]", bg: "hover:bg-[#34d39908]" },
  bearish: { dot: "bg-[#f87171]", bg: "hover:bg-[#f8717108]" },
  neutral: { dot: "bg-[#fbbf24]", bg: "hover:bg-[#fbbf2408]" },
};

export default function InsightsFeed({ events }: { events: Event[] }) {
  return (
    <div className="card p-5 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-white">Live insights</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
          <span className="text-[11px] text-[#34d399] font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((event) => {
          const cfg = typeConfig[event.type];
          return (
            <div key={event.id} className={`rounded-xl px-4 py-3 ${cfg.bg} transition-colors`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <span className="text-[11px] text-[#6b6f7e]">{event.timestamp}</span>
                <span className="text-[#23262f]">·</span>
                <span className="text-[11px] text-[#6b6f7e] font-medium">{event.category}</span>
              </div>
              <p className="text-[12px] text-[#a0a3b1] leading-relaxed">{event.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
