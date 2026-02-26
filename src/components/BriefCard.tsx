"use client";

import { SignalBrief } from "@/lib/mock-data";

export default function BriefCard({ brief }: { brief: SignalBrief }) {
  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-[1px] bg-[#d4af37] flex items-center justify-center">
            <span className="text-[#050a14] font-heading text-[9px]">S</span>
          </div>
          <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1]">LATEST SIGNAL BRIEF</h3>
        </div>
        <span className="font-data text-[9px] text-[#64748b]">{brief.timestamp}</span>
      </div>

      {/* Headline */}
      <h2 className="font-heading text-[16px] tracking-[0.02em] text-[#d4af37] mb-2 leading-tight">
        {brief.headline.toUpperCase()}
      </h2>
      <p className="font-ui text-[10px] text-[#64748b] leading-relaxed mb-5">{brief.summary}</p>

      {/* Highlights */}
      <div className="space-y-1.5">
        {brief.highlights.map((h, i) => {
          const colors = ["border-l-[#d4af37]", "border-l-[#22c55e]", "border-l-[#ef4444]", "border-l-[#06b6d4]", "border-l-[#d4af37]"];
          return (
            <div key={i} className={`bg-[#050a14] border-l-2 ${colors[i % colors.length]} px-4 py-2.5 rounded-[1px] row-hover`}>
              <span className="font-ui text-[10px] text-[#94a3b8]">{h}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
