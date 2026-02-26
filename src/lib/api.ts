// Real data fetchers for The Signal

const CACHE_TTL = 5 * 60 * 1000; // 5 min cache
const cache = new Map<string, { data: unknown; ts: number }>();

async function fetchCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as T;
  const data = await fetcher();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

// =====================
// FEAR & GREED INDEX
// =====================
export async function getFearGreed() {
  return fetchCached("fearGreed", async () => {
    const res = await fetch("https://api.alternative.me/fng/?limit=7", { next: { revalidate: 300 } });
    const data = await res.json();
    return {
      value: parseInt(data.data[0].value),
      label: data.data[0].value_classification,
      history: data.data.map((d: { value: string; timestamp: string }) => ({
        value: parseInt(d.value),
        date: new Date(parseInt(d.timestamp) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })).reverse(),
    };
  });
}

// =====================
// GLOBAL MARKET DATA (CoinGecko)
// =====================
export async function getGlobalMarket() {
  return fetchCached("globalMarket", async () => {
    const res = await fetch("https://api.coingecko.com/api/v3/global", { next: { revalidate: 300 } });
    const d = (await res.json()).data;
    return {
      totalMarketCap: d.total_market_cap.usd,
      totalVolume24h: d.total_volume.usd,
      btcDominance: d.market_cap_percentage.btc,
      ethDominance: d.market_cap_percentage.eth,
      activeCryptos: d.active_cryptocurrencies,
      marketCapChange24h: d.market_cap_change_percentage_24h_usd,
    };
  });
}

// =====================
// DEX VOLUMES (DeFi Llama)
// =====================
export async function getDexVolumes() {
  return fetchCached("dexVolumes", async () => {
    const res = await fetch("https://api.llama.fi/overview/dexs", { next: { revalidate: 300 } });
    const d = await res.json();

    // Top chains by volume
    const chainVolumes: Record<string, number> = {};
    if (d.protocols) {
      for (const p of d.protocols) {
        if (p.chains) {
          for (const chain of p.chains) {
            chainVolumes[chain] = (chainVolumes[chain] || 0) + (p.total24h || 0) / p.chains.length;
          }
        }
      }
    }

    const topChains = Object.entries(chainVolumes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, volume]) => ({ name, volume }));

    return {
      total24h: d.total24h || 0,
      total48hto24h: d.total48hto24h || 0,
      change24h: d.change_1d || 0,
      change7d: d.change_7d || 0,
      change30d: d.change_1m || 0,
      topChains,
    };
  });
}

// =====================
// TVL DATA (DeFi Llama)
// =====================
export async function getTvlData() {
  return fetchCached("tvlData", async () => {
    const res = await fetch("https://api.llama.fi/v2/historicalChainTvl", { next: { revalidate: 300 } });
    const data = await res.json();
    const recent = data.slice(-30); // Last 30 days
    const current = recent[recent.length - 1]?.tvl || 0;
    const weekAgo = recent[recent.length - 8]?.tvl || current;
    const change7d = ((current - weekAgo) / weekAgo) * 100;

    return {
      totalTvl: current,
      change7d,
      history: recent.map((d: { date: number; tvl: number }) => ({
        date: new Date(d.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tvl: d.tvl,
      })),
    };
  });
}

// =====================
// TOP YIELDS (DeFi Llama)
// =====================
export async function getTopYields() {
  return fetchCached("topYields", async () => {
    const res = await fetch("https://yields.llama.fi/pools", { next: { revalidate: 300 } });
    const d = await res.json();
    const pools = d.data || [];

    // Top stable yields (USDC, USDT, DAI)
    const stableYields = pools
      .filter((p: { symbol: string; tvlUsd: number; apy: number }) =>
        p.symbol && /USDC|USDT|DAI/i.test(p.symbol) && p.tvlUsd > 10_000_000 && p.apy > 0
      )
      .sort((a: { apy: number }, b: { apy: number }) => b.apy - a.apy)
      .slice(0, 5)
      .map((p: { project: string; symbol: string; chain: string; apy: number; tvlUsd: number }) => ({
        project: p.project,
        symbol: p.symbol,
        chain: p.chain,
        apy: p.apy,
        tvl: p.tvlUsd,
      }));

    // Top volatile yields (high APY, decent TVL)
    const volatileYields = pools
      .filter((p: { tvlUsd: number; apy: number; symbol: string }) =>
        p.tvlUsd > 5_000_000 && p.apy > 10 && !/USDC|USDT|DAI/i.test(p.symbol || '')
      )
      .sort((a: { apy: number }, b: { apy: number }) => b.apy - a.apy)
      .slice(0, 5)
      .map((p: { project: string; symbol: string; chain: string; apy: number; tvlUsd: number }) => ({
        project: p.project,
        symbol: p.symbol,
        chain: p.chain,
        apy: p.apy,
        tvl: p.tvlUsd,
      }));

    return { stableYields, volatileYields };
  });
}

// =====================
// STABLECOIN DATA (DeFi Llama)
// =====================
export async function getStablecoinData() {
  return fetchCached("stablecoins", async () => {
    const res = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=false", { next: { revalidate: 300 } });
    const d = await res.json();
    const assets = d.peggedAssets || [];

    let totalCirculating = 0;
    let totalPrevDay = 0;

    const top5 = assets
      .filter((a: { circulating: { peggedUSD: number } }) => a.circulating?.peggedUSD > 0)
      .sort((a: { circulating: { peggedUSD: number } }, b: { circulating: { peggedUSD: number } }) =>
        b.circulating.peggedUSD - a.circulating.peggedUSD
      )
      .slice(0, 5)
      .map((a: { name: string; symbol: string; circulating: { peggedUSD: number }; circulatingPrevDay: { peggedUSD: number } }) => {
        totalCirculating += a.circulating.peggedUSD;
        totalPrevDay += a.circulatingPrevDay?.peggedUSD || a.circulating.peggedUSD;
        return {
          name: a.name,
          symbol: a.symbol,
          circulating: a.circulating.peggedUSD,
          change24h: a.circulatingPrevDay?.peggedUSD
            ? ((a.circulating.peggedUSD - a.circulatingPrevDay.peggedUSD) / a.circulatingPrevDay.peggedUSD) * 100
            : 0,
        };
      });

    return {
      totalCirculating,
      change24h: totalPrevDay > 0 ? ((totalCirculating - totalPrevDay) / totalPrevDay) * 100 : 0,
      top5,
    };
  });
}

// =====================
// TRENDING TOKENS (DexScreener)
// =====================
export async function getTrendingTokens() {
  return fetchCached("trending", async () => {
    const res = await fetch("https://api.dexscreener.com/token-boosts/top/v1", { next: { revalidate: 300 } });
    const data = await res.json();
    return (data || []).slice(0, 10).map((t: { tokenAddress: string; chainId: string; description?: string; url?: string; amount?: number }) => ({
      address: t.tokenAddress,
      chain: t.chainId,
      description: t.description || '',
      url: t.url || '',
      amount: t.amount || 0,
    }));
  });
}

// =====================
// AGGREGATE ALL DATA
// =====================
export async function fetchAllSignalData() {
  const [fearGreed, globalMarket, dexVolumes, tvlData, topYields, stablecoins, trending] = await Promise.allSettled([
    getFearGreed(),
    getGlobalMarket(),
    getDexVolumes(),
    getTvlData(),
    getTopYields(),
    getStablecoinData(),
    getTrendingTokens(),
  ]);

  return {
    fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
    globalMarket: globalMarket.status === 'fulfilled' ? globalMarket.value : null,
    dexVolumes: dexVolumes.status === 'fulfilled' ? dexVolumes.value : null,
    tvlData: tvlData.status === 'fulfilled' ? tvlData.value : null,
    topYields: topYields.status === 'fulfilled' ? topYields.value : null,
    stablecoins: stablecoins.status === 'fulfilled' ? stablecoins.value : null,
    trending: trending.status === 'fulfilled' ? trending.value : null,
  };
}

// =====================
// SCORING ENGINE
// =====================
export function calculateScores(data: Awaited<ReturnType<typeof fetchAllSignalData>>) {
  const scores: Record<string, { score: number; metrics: { label: string; value: string; change?: number; signal: string }[] }> = {};

  // Market Sentiment score
  if (data.fearGreed) {
    const fg = data.fearGreed.value;
    scores["Market Sentiment"] = {
      score: fg,
      metrics: [
        { label: "FEAR & GREED INDEX", value: `${fg} — ${data.fearGreed.label}`, signal: fg > 60 ? "bullish" : fg < 40 ? "bearish" : "neutral" },
      ],
    };
  }

  // Onchain Activity score
  if (data.dexVolumes && data.globalMarket) {
    const vol = data.dexVolumes.total24h;
    const volScore = Math.min(100, Math.max(0, (vol / 20_000_000_000) * 100)); // $20B = 100
    scores["Onchain Activity"] = {
      score: Math.round(volScore),
      metrics: [
        { label: "TOTAL DEX VOLUME (24H)", value: formatUsd(vol), change: data.dexVolumes.change24h, signal: data.dexVolumes.change24h > 0 ? "bullish" : "bearish" },
        { label: "VOLUME CHANGE (7D)", value: `${data.dexVolumes.change7d > 0 ? "+" : ""}${data.dexVolumes.change7d.toFixed(1)}%`, signal: data.dexVolumes.change7d > 0 ? "bullish" : "bearish" },
        { label: "TOTAL MARKET CAP", value: formatUsd(data.globalMarket.totalMarketCap), change: data.globalMarket.marketCapChange24h, signal: data.globalMarket.marketCapChange24h > 0 ? "bullish" : "bearish" },
        { label: "ACTIVE CRYPTOCURRENCIES", value: data.globalMarket.activeCryptos.toLocaleString(), signal: "neutral" },
      ],
    };
  }

  // DeFi Yields score
  if (data.topYields && data.tvlData) {
    const tvlChange = data.tvlData.change7d;
    const yieldScore = Math.min(100, Math.max(0, 50 + tvlChange * 5));
    scores["DeFi Yields"] = {
      score: Math.round(yieldScore),
      metrics: [
        { label: "TOTAL DEFI TVL", value: formatUsd(data.tvlData.totalTvl), change: data.tvlData.change7d, signal: tvlChange > 0 ? "bullish" : "bearish" },
        ...(data.topYields.stableYields.slice(0, 2).map((y: { project: string; symbol: string; apy: number }) => ({
          label: `TOP STABLE: ${y.project.toUpperCase()}`,
          value: `${y.symbol} — ${y.apy.toFixed(1)}% APY`,
          signal: y.apy > 5 ? "bullish" : "neutral",
        }))),
        ...(data.topYields.volatileYields.slice(0, 2).map((y: { project: string; symbol: string; apy: number }) => ({
          label: `TOP YIELD: ${y.project.toUpperCase()}`,
          value: `${y.symbol} — ${y.apy.toFixed(1)}% APY`,
          signal: "bullish",
        }))),
      ],
    };
  }

  // Macro Pulse score
  if (data.globalMarket) {
    const mcChange = data.globalMarket.marketCapChange24h;
    const macroScore = Math.min(100, Math.max(0, 50 + mcChange * 5));
    scores["Macro Pulse"] = {
      score: Math.round(macroScore),
      metrics: [
        { label: "BTC DOMINANCE", value: `${data.globalMarket.btcDominance.toFixed(1)}%`, signal: "neutral" },
        { label: "ETH DOMINANCE", value: `${data.globalMarket.ethDominance.toFixed(1)}%`, signal: "neutral" },
        { label: "MARKET CAP (24H)", value: `${mcChange > 0 ? "+" : ""}${mcChange.toFixed(2)}%`, signal: mcChange > 0 ? "bullish" : "bearish" },
        { label: "TOTAL VOLUME (24H)", value: formatUsd(data.globalMarket.totalVolume24h), signal: "neutral" },
      ],
    };
  }

  // Stablecoin / liquidity score
  if (data.stablecoins) {
    const scChange = data.stablecoins.change24h;
    const scScore = Math.min(100, Math.max(0, 50 + scChange * 20));
    scores["Stablecoins"] = {
      score: Math.round(scScore),
      metrics: [
        { label: "TOTAL STABLECOIN SUPPLY", value: formatUsd(data.stablecoins.totalCirculating), change: scChange, signal: scChange > 0 ? "bullish" : "bearish" },
        ...data.stablecoins.top5.slice(0, 3).map((s: { symbol: string; circulating: number; change24h: number }) => ({
          label: s.symbol,
          value: formatUsd(s.circulating),
          change: s.change24h,
          signal: s.change24h > 0 ? "bullish" : s.change24h < 0 ? "bearish" : "neutral",
        })),
      ],
    };
  }

  return scores;
}

function formatUsd(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}
