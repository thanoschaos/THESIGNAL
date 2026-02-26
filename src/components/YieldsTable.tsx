"use client";

interface YieldsTableProps {
  yields: {
    stableYields: { project: string; symbol: string; chain: string; apy: number; tvl: number }[];
    volatileYields: { project: string; symbol: string; chain: string; apy: number; tvl: number }[];
  } | null;
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function YieldsTable({ yields }: YieldsTableProps) {
  if (!yields) return <div className="card p-5"><p className="text-[#6b6f7e]">Loading yields...</p></div>;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-white">Top Yields</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#34d399] bg-[#34d39915] px-2 py-0.5 rounded-full font-medium">LIVE</span>
        </div>
      </div>

      {/* Stable yields */}
      <p className="text-[10px] text-[#6b6f7e] uppercase tracking-wider mb-2 font-semibold">Stablecoin Yields</p>
      <div className="space-y-1 mb-4">
        {yields.stableYields.slice(0, 4).map((y, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#1c1f2a] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#6b6f7e] w-4">{i + 1}</span>
              <div>
                <p className="text-[12px] text-white font-medium">{y.symbol}</p>
                <p className="text-[10px] text-[#6b6f7e]">{y.project} · {y.chain}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-[#34d399] font-semibold">{y.apy.toFixed(2)}% APY</p>
              <p className="text-[10px] text-[#6b6f7e]">{fmt(y.tvl)} TVL</p>
            </div>
          </div>
        ))}
      </div>

      {/* Volatile yields */}
      <p className="text-[10px] text-[#6b6f7e] uppercase tracking-wider mb-2 font-semibold">High Yield Opportunities</p>
      <div className="space-y-1">
        {yields.volatileYields.slice(0, 4).map((y, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#1c1f2a] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#6b6f7e] w-4">{i + 1}</span>
              <div>
                <p className="text-[12px] text-white font-medium">{y.symbol}</p>
                <p className="text-[10px] text-[#6b6f7e]">{y.project} · {y.chain}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-[#fbbf24] font-semibold">{y.apy.toFixed(1)}% APY</p>
              <p className="text-[10px] text-[#6b6f7e]">{fmt(y.tvl)} TVL</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
