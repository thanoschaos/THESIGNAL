"use client";

import { SignalBrief } from "@/lib/mock-data";

export default function BriefCard({ brief }: { brief: SignalBrief }) {
  return (
    <div className="signal-card rounded-xl bg-[#16161f] p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-[#e8e8ed]">Latest Brief</h3>
        </div>
        <span className="text-xs text-[#8888a0]">{brief.timestamp}</span>
      </div>

      <h2 className="text-lg font-bold text-[#e8e8ed] mb-3">{brief.headline}</h2>
      <p className="text-sm text-[#8888a0] leading-relaxed mb-4">{brief.summary}</p>

      <div className="space-y-2">
        {brief.highlights.map((h, i) => (
          <div key={i} className="text-sm text-[#e8e8ed] bg-[#0a0a0f] rounded-lg px-3 py-2">
            {h}
          </div>
        ))}
      </div>
    </div>
  );
}
