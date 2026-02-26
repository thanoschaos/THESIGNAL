"use client";

// Activity heatmap — rows = days, cols = time periods
const heatData = [
  [10, 40, 70, 100, 70],
  [40, 70, 100, 70, 40],
  [10, 40, 70, 40, 10],
  [70, 100, 70, 40, 70],
  [40, 70, 100, 100, 40],
];

const timeLabels = ["00-06", "06-12", "12-18", "18-00", "AVG"];
const dayLabels = ["MON", "TUE", "WED", "THU", "FRI"];

function getHeatClass(val: number) {
  if (val >= 100) return "heat-100";
  if (val >= 70) return "heat-70";
  if (val >= 40) return "heat-40";
  return "heat-10";
}

export default function Heatmap() {
  return (
    <div className="card p-4">
      <h3 className="font-heading text-[10px] tracking-[0.15em] text-[#cbd5e1] mb-3">ACTIVITY HEATMAP</h3>
      <p className="font-data text-[8px] text-[#64748b] mb-3">ONCHAIN VOLUME DISTRIBUTION · 7D</p>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1 justify-center">
          {dayLabels.map((d) => (
            <div key={d} className="h-3 flex items-center">
              <span className="font-data text-[7px] text-[#475569]">{d}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div>
          {/* Time labels */}
          <div className="flex gap-1 mb-1">
            {timeLabels.map((t) => (
              <div key={t} className="w-3 flex justify-center">
                <span className="font-data text-[6px] text-[#475569]">{t}</span>
              </div>
            ))}
          </div>

          {/* Cells */}
          {heatData.map((row, ri) => (
            <div key={ri} className="flex gap-1 mb-1">
              {row.map((val, ci) => (
                <div key={ci} className={`heat-cell ${getHeatClass(val)}`} title={`${val}% ACTIVITY`} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1e293b]">
        <span className="font-data text-[7px] text-[#475569]">LOW</span>
        <div className="flex gap-0.5">
          {[10, 40, 70, 100].map((v) => (
            <div key={v} className={`w-2 h-2 heat-cell ${getHeatClass(v)}`} />
          ))}
        </div>
        <span className="font-data text-[7px] text-[#475569]">HIGH</span>
      </div>
    </div>
  );
}
