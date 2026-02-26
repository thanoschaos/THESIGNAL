// Mock data for MVP — will be replaced with real API calls

export interface CategoryScore {
  name: string;
  emoji: string;
  score: number;
  change: number; // vs last reading
  description: string;
  metrics: Metric[];
}

export interface Metric {
  label: string;
  value: string;
  change?: number;
  signal?: 'bullish' | 'bearish' | 'neutral';
}

export interface SignalBrief {
  id: string;
  timestamp: string;
  compositeScore: number;
  scoreChange: number;
  headline: string;
  summary: string;
  highlights: string[];
  categories: CategoryScore[];
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  type: 'bullish' | 'bearish' | 'neutral';
  message: string;
  category: string;
}

export const mockCategories: CategoryScore[] = [
  {
    name: "DegenFi",
    emoji: "🎰",
    score: 62,
    change: 8,
    description: "Onchain degen activity & memecoin trenches",
    metrics: [
      { label: "Pump.fun Graduation Rate", value: "1.2%", change: 0.3, signal: "bullish" },
      { label: "New Token Launches (24h)", value: "12,847", change: 15, signal: "neutral" },
      { label: "Bonding Curve Completions", value: "154", change: 22, signal: "bullish" },
      { label: "Memecoin Volume (SOL)", value: "$847M", change: -5, signal: "neutral" },
      { label: "Rug Pull Rate (24h)", value: "34%", change: -8, signal: "bullish" },
      { label: "Top Graduated Token", value: "CHAD (+340%)", signal: "bullish" },
    ],
  },
  {
    name: "Onchain Activity",
    emoji: "📊",
    score: 71,
    change: 3,
    description: "Blockchain health & transaction activity",
    metrics: [
      { label: "Total DEX Volume (24h)", value: "$14.2B", change: 12, signal: "bullish" },
      { label: "Top Chain (Volume)", value: "Solana — $5.8B", signal: "bullish" },
      { label: "Active Wallets (24h)", value: "2.4M", change: 7, signal: "bullish" },
      { label: "ETH Gas (Gwei)", value: "18", change: -12, signal: "neutral" },
      { label: "Stablecoin Minted (24h)", value: "+$240M", signal: "bullish" },
      { label: "Bridge Volume (24h)", value: "$890M", change: 5, signal: "neutral" },
    ],
  },
  {
    name: "Smart Money",
    emoji: "🐋",
    score: 78,
    change: 12,
    description: "Whale & institutional wallet movements",
    metrics: [
      { label: "Whale Accumulation", value: "Strong Buy", signal: "bullish" },
      { label: "Exchange Outflows (24h)", value: "-$340M", signal: "bullish" },
      { label: "Labeled Fund Moves", value: "7 buys / 2 sells", signal: "bullish" },
      { label: "Large Txns (>$1M)", value: "234", change: 18, signal: "bullish" },
      { label: "Smart Money Consensus", value: "ETH, AERO, PENDLE", signal: "neutral" },
      { label: "Exchange Reserves", value: "↓ 2.1% (7d)", signal: "bullish" },
    ],
  },
  {
    name: "Market Sentiment",
    emoji: "🌡️",
    score: 58,
    change: -4,
    description: "Fear/greed, leverage & social sentiment",
    metrics: [
      { label: "Fear & Greed Index", value: "62 — Greed", signal: "neutral" },
      { label: "BTC Funding Rate", value: "0.012%", signal: "neutral" },
      { label: "Open Interest Change", value: "+$1.2B", change: 8, signal: "neutral" },
      { label: "Liquidations (24h)", value: "$89M longs / $34M shorts", signal: "bearish" },
      { label: "Social Buzz", value: "↑ 24% (AI, RWA trending)", signal: "bullish" },
      { label: "Long/Short Ratio", value: "1.4 (longs heavy)", signal: "bearish" },
    ],
  },
  {
    name: "DeFi Yields",
    emoji: "💰",
    score: 65,
    change: 2,
    description: "Best yield opportunities & TVL flows",
    metrics: [
      { label: "Top Yield (Stable)", value: "Aave USDC — 8.2%", signal: "bullish" },
      { label: "Top Yield (Volatile)", value: "Aerodrome ETH/AERO — 42%", signal: "bullish" },
      { label: "Total DeFi TVL", value: "$142B", change: 3, signal: "bullish" },
      { label: "TVL Change (7d)", value: "+$4.2B", signal: "bullish" },
      { label: "New Pools (24h)", value: "847", signal: "neutral" },
      { label: "Avg Staking APY (ETH)", value: "3.4%", change: -0.2, signal: "neutral" },
    ],
  },
  {
    name: "Macro Pulse",
    emoji: "🔮",
    score: 69,
    change: 1,
    description: "Big picture crypto & TradFi correlation",
    metrics: [
      { label: "BTC Dominance", value: "52.4%", change: -0.3, signal: "neutral" },
      { label: "ETH/BTC Ratio", value: "0.041", change: 2, signal: "bullish" },
      { label: "Total Market Cap", value: "$3.2T", change: 1.5, signal: "bullish" },
      { label: "BTC ETF Flows (24h)", value: "+$187M", signal: "bullish" },
      { label: "DXY (Dollar Index)", value: "103.2", change: -0.4, signal: "bullish" },
      { label: "S&P 500 Correlation", value: "0.62 (moderate)", signal: "neutral" },
    ],
  },
];

export const mockLiveEvents: LiveEvent[] = [
  { id: "1", timestamp: "2:42 PM", type: "bullish", message: "AERO volume 5x'd in 15 min. Whale accumulated $2.3M. Last time this pattern hit, it ran 40%.", category: "Smart Money" },
  { id: "2", timestamp: "2:38 PM", type: "neutral", message: "New WETH/UNKNOWN pair on Base. $400K liquidity added. Contract verified but no socials yet.", category: "DegenFi" },
  { id: "3", timestamp: "2:30 PM", type: "bullish", message: "ETH reclaimed $3,800. Historically bullish when held for 4h+. Smart money loading.", category: "Macro Pulse" },
  { id: "4", timestamp: "2:22 PM", type: "bearish", message: "Funding rates spiking on BTC perps. Overleveraged longs at risk if we dip below $98K.", category: "Market Sentiment" },
  { id: "5", timestamp: "2:15 PM", type: "bullish", message: "Pump.fun graduation rate hit 1.8% — highest in 3 weeks. Degen sentiment heating up.", category: "DegenFi" },
  { id: "6", timestamp: "2:08 PM", type: "neutral", message: "$120M USDC minted on Ethereum. Fresh capital entering. Watch for deployment.", category: "Onchain Activity" },
  { id: "7", timestamp: "1:55 PM", type: "bullish", message: "3 Nansen-labeled VCs moved into PENDLE. Combined $4.7M position.", category: "Smart Money" },
  { id: "8", timestamp: "1:42 PM", type: "bearish", message: "BTC ETF saw $45M outflow in last hour. First negative flow this week.", category: "Macro Pulse" },
];

export const mockBrief: SignalBrief = {
  id: "brief-001",
  timestamp: "Feb 25, 2026 — 1:00 PM PST",
  compositeScore: 67,
  scoreChange: 4,
  headline: "Smart money loading while degens heat up — cautiously bullish",
  summary: "Whale accumulation is the strongest signal today. Three labeled VC funds entered new positions, exchange outflows accelerated, and the graduation rate on Pump.fun hit a 3-week high. The main risk is overleveraged longs on BTC perps — funding rates are elevated. Overall posture: bullish with a tight stop.",
  highlights: [
    "🐋 Whale accumulation strongest in 2 weeks — exchange outflows at -$340M",
    "🎰 Pump.fun graduation rate at 1.8% — degen sentiment returning",
    "⚠️ BTC funding rate elevated at 0.012% — longs overleveraged",
    "💰 Fresh $240M USDC minted — new capital entering the system",
    "📈 ETH reclaimed $3,800 — historically bullish if held 4h+",
  ],
  categories: mockCategories,
};

export function getCompositeScore(categories: CategoryScore[]): number {
  // Weighted average — can be customized
  const weights: Record<string, number> = {
    "DegenFi": 0.12,
    "Onchain Activity": 0.18,
    "Smart Money": 0.25,
    "Market Sentiment": 0.20,
    "DeFi Yields": 0.10,
    "Macro Pulse": 0.15,
  };
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const cat of categories) {
    const w = weights[cat.name] || 0.15;
    weightedSum += cat.score * w;
    totalWeight += w;
  }
  
  return Math.round(weightedSum / totalWeight);
}
