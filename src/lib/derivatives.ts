// Derivatives & CEX flow data from OKX (free, no API key)

export interface DerivativesData {
  btc: {
    fundingRate: number;
    openInterest: number;
    volume24h: number;
    longShortRatio: number[];  // hourly history
    takerBuyVol: number;
    takerSellVol: number;
    takerRatio: number;
  };
  eth: {
    fundingRate: number;
    openInterest: number;
    volume24h: number;
    longShortRatio: number[];
    takerBuyVol: number;
    takerSellVol: number;
    takerRatio: number;
  };
  topCoins: {
    symbol: string;
    fundingRate: number;
    openInterest: number;
  }[];
}

async function fetchOKX(path: string) {
  const res = await fetch(`https://www.okx.com${path}`, {
    next: { revalidate: 300 },
    headers: { 'Accept': 'application/json' },
  });
  return res.json();
}

async function getCoinData(ccy: string, instId: string) {
  const [fundingRes, oiRes, lsRes, takerRes] = await Promise.allSettled([
    fetchOKX(`/api/v5/public/funding-rate?instId=${instId}`),
    fetchOKX(`/api/v5/rubik/stat/contracts/open-interest-volume?ccy=${ccy}&period=1D`),
    fetchOKX(`/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=${ccy}&period=1H`),
    fetchOKX(`/api/v5/rubik/stat/taker-volume?ccy=${ccy}&instType=CONTRACTS&period=1H`),
  ]);

  const funding = fundingRes.status === 'fulfilled' ? fundingRes.value : null;
  const oi = oiRes.status === 'fulfilled' ? oiRes.value : null;
  const ls = lsRes.status === 'fulfilled' ? lsRes.value : null;
  const taker = takerRes.status === 'fulfilled' ? takerRes.value : null;

  const fundingRate = funding?.data?.[0]?.fundingRate ? parseFloat(funding.data[0].fundingRate) * 100 : 0;
  const openInterest = oi?.data?.[0]?.[1] ? parseFloat(oi.data[0][1]) : 0;
  const volume24h = oi?.data?.[0]?.[2] ? parseFloat(oi.data[0][2]) : 0;

  const longShortRatio = (ls?.data || [])
    .slice(0, 24)
    .map((d: string[]) => parseFloat(d[1]))
    .reverse();

  let takerBuyVol = 0;
  let takerSellVol = 0;
  if (taker?.data?.[0]) {
    takerBuyVol = parseFloat(taker.data[0][1] || '0');
    takerSellVol = parseFloat(taker.data[0][2] || '0');
  }

  return {
    fundingRate,
    openInterest,
    volume24h,
    longShortRatio,
    takerBuyVol,
    takerSellVol,
    takerRatio: takerSellVol > 0 ? takerBuyVol / takerSellVol : 1,
  };
}

export async function fetchDerivativesData(): Promise<DerivativesData | null> {
  try {
    const [btc, eth] = await Promise.all([
      getCoinData('BTC', 'BTC-USDT-SWAP'),
      getCoinData('ETH', 'ETH-USDT-SWAP'),
    ]);

    // Fetch funding rates for more coins
    const topSymbols = ['SOL-USDT-SWAP', 'DOGE-USDT-SWAP', 'XRP-USDT-SWAP', 'AVAX-USDT-SWAP', 'LINK-USDT-SWAP', 'ARB-USDT-SWAP'];
    const topCoinsResults = await Promise.allSettled(
      topSymbols.map(async (instId) => {
        const [fRes, oiRes] = await Promise.allSettled([
          fetchOKX(`/api/v5/public/funding-rate?instId=${instId}`),
          fetchOKX(`/api/v5/rubik/stat/contracts/open-interest-volume?ccy=${instId.split('-')[0]}&period=1D`),
        ]);
        const f = fRes.status === 'fulfilled' ? fRes.value : null;
        const o = oiRes.status === 'fulfilled' ? oiRes.value : null;
        return {
          symbol: instId.split('-')[0],
          fundingRate: f?.data?.[0]?.fundingRate ? parseFloat(f.data[0].fundingRate) * 100 : 0,
          openInterest: o?.data?.[0]?.[1] ? parseFloat(o.data[0][1]) : 0,
        };
      })
    );

    const topCoins = topCoinsResults
      .filter((r): r is PromiseFulfilledResult<{ symbol: string; fundingRate: number; openInterest: number }> => r.status === 'fulfilled')
      .map(r => r.value);

    return { btc, eth, topCoins };
  } catch {
    return null;
  }
}

export function analyzeDerivatives(data: DerivativesData) {
  const { btc, eth } = data;

  // Leverage score (0-100)
  // High funding = overleveraged = risky
  // Extreme L/S ratio = one-sided = risky
  const latestLS = btc.longShortRatio[btc.longShortRatio.length - 1] || 1;
  const fundingScore = Math.max(0, 100 - Math.abs(btc.fundingRate) * 2000); // 0.05% = extreme
  const lsScore = Math.max(0, 100 - Math.abs(latestLS - 1) * 100); // 1.0 = balanced
  const takerScore = btc.takerRatio > 0.9 && btc.takerRatio < 1.1 ? 60 : btc.takerRatio > 1 ? 70 : 40;
  const leverageScore = Math.round((fundingScore * 0.4 + lsScore * 0.3 + takerScore * 0.3));

  // Determine bias
  let bias: 'LONG HEAVY' | 'SHORT HEAVY' | 'BALANCED' = 'BALANCED';
  if (latestLS > 1.3) bias = 'LONG HEAVY';
  if (latestLS < 0.8) bias = 'SHORT HEAVY';

  // Funding analysis
  let fundingSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (btc.fundingRate > 0.03) fundingSignal = 'bearish'; // Longs paying too much
  if (btc.fundingRate < -0.01) fundingSignal = 'bullish'; // Shorts paying = potential squeeze

  // Taker analysis
  let takerSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (btc.takerRatio > 1.1) takerSignal = 'bullish'; // More buyers
  if (btc.takerRatio < 0.9) takerSignal = 'bearish'; // More sellers

  return {
    score: leverageScore,
    bias,
    fundingSignal,
    takerSignal,
    latestLS,
    analysis: generateLeverageAnalysis(btc, eth, latestLS, bias),
  };
}

function generateLeverageAnalysis(
  btc: DerivativesData['btc'],
  eth: DerivativesData['eth'],
  latestLS: number,
  bias: string
): string {
  const parts: string[] = [];

  // Funding
  if (Math.abs(btc.fundingRate) < 0.005) {
    parts.push(`BTC funding rate at ${btc.fundingRate.toFixed(4)}% is neutral — no strong directional pressure from leveraged traders.`);
  } else if (btc.fundingRate > 0.02) {
    parts.push(`BTC funding rate at ${btc.fundingRate.toFixed(4)}% is elevated — longs are paying shorts, indicating bullish leverage is building. Historically, rates above 0.03% precede mean-reversion moves.`);
  } else if (btc.fundingRate < -0.005) {
    parts.push(`BTC funding rate is negative at ${btc.fundingRate.toFixed(4)}% — shorts are paying longs. This often precedes short squeezes as negative funding becomes expensive to maintain.`);
  } else {
    parts.push(`BTC funding rate at ${btc.fundingRate.toFixed(4)}% is slightly ${btc.fundingRate > 0 ? 'positive' : 'negative'} — mild ${btc.fundingRate > 0 ? 'long' : 'short'} bias in the market.`);
  }

  // Long/Short
  if (latestLS > 1.4) {
    parts.push(`The long/short ratio at ${latestLS.toFixed(2)} shows heavy long positioning. When the crowd is this one-sided, a flush of overleveraged longs becomes likely.`);
  } else if (latestLS < 0.7) {
    parts.push(`The long/short ratio at ${latestLS.toFixed(2)} shows heavy short positioning — potential fuel for a short squeeze.`);
  } else {
    parts.push(`Long/short ratio at ${latestLS.toFixed(2)} is relatively ${bias === 'BALANCED' ? 'balanced' : bias.toLowerCase()} — no extreme positioning.`);
  }

  // Taker
  if (btc.takerRatio < 0.85) {
    parts.push(`Sellers are dominating taker flow (buy/sell ratio: ${btc.takerRatio.toFixed(2)}). Market sells typically indicate conviction to the downside.`);
  } else if (btc.takerRatio > 1.15) {
    parts.push(`Buyers are aggressively taking (buy/sell ratio: ${btc.takerRatio.toFixed(2)}). Strong taker buying often front-runs moves higher.`);
  }

  // OI
  const oiBillions = btc.openInterest / 1e9;
  parts.push(`BTC open interest sits at $${oiBillions.toFixed(1)}B on OKX. ${oiBillions > 5 ? 'Elevated OI means more leveraged positions at risk during volatility.' : 'OI levels are moderate.'}`);

  return parts.join(' ');
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export function getDerivativesMetrics(data: DerivativesData) {
  const analysis = analyzeDerivatives(data);
  const { btc, eth } = data;

  return {
    score: analysis.score,
    bias: analysis.bias,
    analysis: analysis.analysis,
    fundingSignal: analysis.fundingSignal,
    takerSignal: analysis.takerSignal,
    metrics: [
      { label: "BTC FUNDING RATE", value: `${btc.fundingRate.toFixed(4)}%`, signal: analysis.fundingSignal },
      { label: "ETH FUNDING RATE", value: `${eth.fundingRate.toFixed(4)}%`, signal: eth.fundingRate > 0.03 ? "bearish" : eth.fundingRate < -0.01 ? "bullish" : "neutral" as const },
      { label: "BTC OPEN INTEREST", value: fmt(btc.openInterest), signal: "neutral" as const },
      { label: "BTC L/S RATIO", value: `${(btc.longShortRatio[btc.longShortRatio.length - 1] || 0).toFixed(2)}`, signal: (btc.longShortRatio[btc.longShortRatio.length - 1] || 1) > 1.3 ? "bearish" : "neutral" as const },
      { label: "TAKER BUY/SELL", value: `${btc.takerRatio.toFixed(2)}`, signal: analysis.takerSignal },
      { label: "BTC 24H VOLUME", value: fmt(btc.volume24h), signal: "neutral" as const },
      { label: "MARKET BIAS", value: analysis.bias, signal: analysis.bias === 'LONG HEAVY' ? "bearish" : analysis.bias === 'SHORT HEAVY' ? "bullish" : "neutral" as const },
    ],
    longShortHistory: btc.longShortRatio,
    topCoins: data.topCoins,
  };
}
