// AI-style analysis generator from real data

interface AnalysisData {
  fearGreed: { value: number; label: string } | null;
  globalMarket: { totalMarketCap: number; totalVolume24h: number; btcDominance: number; ethDominance: number; marketCapChange24h: number } | null;
  dexVolumes: { total24h: number; change24h: number; change7d: number } | null;
  tvlData: { totalTvl: number; change7d: number } | null;
  topYields: { stableYields: { project: string; symbol: string; apy: number }[]; volatileYields: { project: string; symbol: string; apy: number }[] } | null;
  stablecoins: { totalCirculating: number; change24h: number } | null;
}

export interface Brief {
  id: string;
  timestamp: string;
  compositeScore: number;
  sentiment: "BULLISH" | "NEUTRAL" | "BEARISH" | "CAUTIOUS";
  headline: string;
  tldr: string;
  sections: {
    title: string;
    emoji: string;
    analysis: string;
    signal: "bullish" | "bearish" | "neutral";
    keyMetrics: { label: string; value: string; signal: "bullish" | "bearish" | "neutral" }[];
  }[];
  keyTakeaways: string[];
  riskFactors: string[];
}

function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export function generateBrief(data: AnalysisData, scores: Record<string, { score: number }>): Brief {
  const allScores = Object.values(scores).map(s => s.score);
  const compositeScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 50;

  const sentiment = compositeScore >= 70 ? "BULLISH" : compositeScore >= 50 ? "NEUTRAL" : compositeScore >= 30 ? "CAUTIOUS" : "BEARISH";

  // Generate dynamic headline
  const fg = data.fearGreed?.value ?? 50;
  const mcChange = data.globalMarket?.marketCapChange24h ?? 0;
  const dexChange = data.dexVolumes?.change7d ?? 0;
  const tvlChange = data.tvlData?.change7d ?? 0;

  let headline = "";
  if (fg < 25) {
    headline = `Extreme Fear grips the market at ${fg}/100`;
    if (dexChange > 0) headline += " — but DEX volume tells a different story";
    else headline += " — volume confirms the weakness";
  } else if (fg < 40) {
    headline = `Fear dominates with sentiment at ${fg}/100`;
    if (tvlChange > 0) headline += " while TVL quietly climbs";
    else headline += " as capital exits DeFi";
  } else if (fg < 60) {
    headline = `Market in neutral territory at ${fg}/100`;
    if (mcChange > 0) headline += " — slight bullish momentum building";
    else headline += " — waiting for a catalyst";
  } else if (fg < 75) {
    headline = `Greed rising with sentiment at ${fg}/100`;
    headline += dexChange > 10 ? " — volume surge confirms conviction" : " — but volume hasn't caught up yet";
  } else {
    headline = `Extreme Greed at ${fg}/100 — caution warranted`;
    headline += " as markets may be overheated";
  }

  // TLDR
  const tldr = `Composite score sits at ${compositeScore}/100 (${sentiment}). Fear & Greed at ${fg} (${data.fearGreed?.label ?? 'N/A'}). Market cap ${mcChange > 0 ? "up" : "down"} ${Math.abs(mcChange).toFixed(2)}% in 24h. DEX volume at ${data.dexVolumes ? fmt(data.dexVolumes.total24h) : 'N/A'} (${dexChange > 0 ? "+" : ""}${dexChange.toFixed(1)}% 7d). Total DeFi TVL at ${data.tvlData ? fmt(data.tvlData.totalTvl) : 'N/A'}.`;

  // Sections
  const sections: Brief["sections"] = [];

  // Market Sentiment section
  if (data.fearGreed && data.globalMarket) {
    const fgSignal = fg > 60 ? "bullish" : fg < 40 ? "bearish" : "neutral";
    let analysis = "";

    if (fg < 20) {
      analysis = `The Fear & Greed Index has plunged to ${fg}, deep into Extreme Fear territory. Historically, these levels have marked significant buying opportunities — but they can also persist during extended downtrends. The market is pricing in maximum pessimism right now.`;
    } else if (fg < 40) {
      analysis = `Sentiment sits at ${fg} (${data.fearGreed.label}). The market is nervous but not panicking. This is often a transition zone — either fear deepens into capitulation or we see a sentiment reversal. Watch for volume confirmation.`;
    } else if (fg < 60) {
      analysis = `The Fear & Greed Index reads ${fg}, placing us in neutral territory. Neither bulls nor bears have conviction here. This is typically a consolidation zone where the market waits for a catalyst.`;
    } else if (fg < 80) {
      analysis = `Greed is building at ${fg}/100. Market participants are getting confident, which can fuel continued upside — but also sets the stage for a correction when positioning gets too one-sided.`;
    } else {
      analysis = `Extreme Greed at ${fg}/100 is a warning sign. While momentum can carry prices higher in the short term, history shows these readings often precede sharp pullbacks. Risk management is critical here.`;
    }

    sections.push({
      title: "Market Sentiment",
      emoji: "🌡️",
      analysis,
      signal: fgSignal as "bullish" | "bearish" | "neutral",
      keyMetrics: [
        { label: "FEAR & GREED", value: `${fg} — ${data.fearGreed.label}`, signal: fgSignal as "bullish" | "bearish" | "neutral" },
        { label: "MARKET CAP 24H", value: `${mcChange > 0 ? "+" : ""}${mcChange.toFixed(2)}%`, signal: mcChange > 0 ? "bullish" : "bearish" },
        { label: "BTC DOMINANCE", value: `${data.globalMarket.btcDominance.toFixed(1)}%`, signal: "neutral" },
      ],
    });
  }

  // Onchain / DEX volume section
  if (data.dexVolumes) {
    const volSignal = data.dexVolumes.change7d > 5 ? "bullish" : data.dexVolumes.change7d < -5 ? "bearish" : "neutral";
    let analysis = "";

    const vol24h = fmt(data.dexVolumes.total24h);
    if (data.dexVolumes.change7d > 15) {
      analysis = `DEX volume is surging at ${vol24h} in the last 24 hours, up ${data.dexVolumes.change7d.toFixed(1)}% over the past week. This kind of volume expansion typically signals growing conviction among onchain traders. When volume leads price, it's often a reliable bullish indicator.`;
    } else if (data.dexVolumes.change7d > 0) {
      analysis = `DEX volume sits at ${vol24h} over the last 24 hours with a modest ${data.dexVolumes.change7d.toFixed(1)}% increase week-over-week. Volume is trending slightly positive but hasn't reached levels that would signal a strong directional move. The market is active but not euphoric.`;
    } else {
      analysis = `DEX volume has contracted to ${vol24h} in 24 hours, declining ${Math.abs(data.dexVolumes.change7d).toFixed(1)}% over the past week. Declining volume often signals reduced conviction and can precede further weakness — or simply reflect a quiet period before the next move.`;
    }

    sections.push({
      title: "Onchain Activity",
      emoji: "📊",
      analysis,
      signal: volSignal as "bullish" | "bearish" | "neutral",
      keyMetrics: [
        { label: "DEX VOLUME 24H", value: vol24h, signal: volSignal as "bullish" | "bearish" | "neutral" },
        { label: "7D CHANGE", value: `${data.dexVolumes.change7d > 0 ? "+" : ""}${data.dexVolumes.change7d.toFixed(1)}%`, signal: volSignal as "bullish" | "bearish" | "neutral" },
        { label: "24H CHANGE", value: `${data.dexVolumes.change24h > 0 ? "+" : ""}${data.dexVolumes.change24h.toFixed(1)}%`, signal: data.dexVolumes.change24h > 0 ? "bullish" : "bearish" },
      ],
    });
  }

  // DeFi / TVL section
  if (data.tvlData) {
    const tvlSignal = data.tvlData.change7d > 2 ? "bullish" : data.tvlData.change7d < -2 ? "bearish" : "neutral";
    let analysis = "";

    if (data.tvlData.change7d > 5) {
      analysis = `Total DeFi TVL stands at ${fmt(data.tvlData.totalTvl)}, growing ${data.tvlData.change7d.toFixed(1)}% over the past week. Capital is flowing into DeFi protocols at an accelerating pace — a clear sign of growing confidence in the ecosystem. This usually precedes broader market strength.`;
    } else if (data.tvlData.change7d > 0) {
      analysis = `DeFi TVL is at ${fmt(data.tvlData.totalTvl)} with a ${data.tvlData.change7d.toFixed(1)}% increase over 7 days. Steady capital inflows suggest the DeFi ecosystem remains healthy, though we're not seeing the explosive growth that characterizes bull market peaks.`;
    } else {
      analysis = `Total DeFi TVL has declined to ${fmt(data.tvlData.totalTvl)}, shedding ${Math.abs(data.tvlData.change7d).toFixed(1)}% over the past week. Capital is leaving DeFi protocols — which could reflect broader risk-off sentiment, yield compression, or rotation into other asset classes.`;
    }

    sections.push({
      title: "DeFi & TVL",
      emoji: "🔒",
      analysis,
      signal: tvlSignal as "bullish" | "bearish" | "neutral",
      keyMetrics: [
        { label: "TOTAL TVL", value: fmt(data.tvlData.totalTvl), signal: tvlSignal as "bullish" | "bearish" | "neutral" },
        { label: "7D CHANGE", value: `${data.tvlData.change7d > 0 ? "+" : ""}${data.tvlData.change7d.toFixed(1)}%`, signal: tvlSignal as "bullish" | "bearish" | "neutral" },
      ],
    });
  }

  // Yields section
  if (data.topYields) {
    const topStable = data.topYields.stableYields[0];
    const topVolatile = data.topYields.volatileYields[0];

    let analysis = `The best stablecoin yield available right now is ${topStable?.apy.toFixed(1)}% on ${topStable?.symbol} (${topStable?.project}). `;

    if (topStable && topStable.apy > 8) {
      analysis += `Stable yields above 8% are elevated — this typically reflects high demand for leverage in the system, which can be both an opportunity and a risk indicator. `;
    } else if (topStable && topStable.apy > 5) {
      analysis += `Stable yields in the 5-8% range are healthy and sustainable. `;
    } else {
      analysis += `Stable yields below 5% suggest low demand for leverage — the market isn't paying much for capital right now. `;
    }

    if (topVolatile) {
      analysis += `For risk-tolerant capital, ${topVolatile.symbol} on ${topVolatile.project} is offering ${topVolatile.apy.toFixed(0)}% APY — high reward but comes with impermanent loss and smart contract risk.`;
    }

    sections.push({
      title: "Yield Landscape",
      emoji: "💰",
      analysis,
      signal: topStable && topStable.apy > 5 ? "bullish" : "neutral",
      keyMetrics: [
        ...(topStable ? [{ label: `BEST STABLE: ${topStable.project.toUpperCase()}`, value: `${topStable.symbol} — ${topStable.apy.toFixed(1)}%`, signal: "bullish" as const }] : []),
        ...(topVolatile ? [{ label: `BEST VOLATILE: ${topVolatile.project.toUpperCase()}`, value: `${topVolatile.symbol} — ${topVolatile.apy.toFixed(0)}%`, signal: "neutral" as const }] : []),
      ],
    });
  }

  // Stablecoin flows
  if (data.stablecoins) {
    const scSignal = data.stablecoins.change24h > 0 ? "bullish" : data.stablecoins.change24h < -0.01 ? "bearish" : "neutral";
    let analysis = `Total stablecoin supply sits at ${fmt(data.stablecoins.totalCirculating)}`;

    if (data.stablecoins.change24h > 0.01) {
      analysis += `, with ${fmt(data.stablecoins.totalCirculating * data.stablecoins.change24h / 100)} minted in the last 24 hours. Fresh stablecoin minting is one of the most reliable bullish signals — it means new capital is entering the crypto ecosystem. This money needs to go somewhere.`;
    } else if (data.stablecoins.change24h < -0.01) {
      analysis += `, declining over the past 24 hours. Stablecoin redemptions suggest capital is leaving the ecosystem — a bearish signal for near-term price action.`;
    } else {
      analysis += `, holding steady over the last 24 hours. No significant minting or redemption activity suggests the market is in a wait-and-see mode.`;
    }

    sections.push({
      title: "Stablecoin Flows",
      emoji: "💵",
      analysis,
      signal: scSignal as "bullish" | "bearish" | "neutral",
      keyMetrics: [
        { label: "TOTAL SUPPLY", value: fmt(data.stablecoins.totalCirculating), signal: scSignal as "bullish" | "bearish" | "neutral" },
        { label: "24H CHANGE", value: `${data.stablecoins.change24h > 0 ? "+" : ""}${data.stablecoins.change24h.toFixed(3)}%`, signal: scSignal as "bullish" | "bearish" | "neutral" },
      ],
    });
  }

  // Macro section
  if (data.globalMarket) {
    const mcSignal = data.globalMarket.marketCapChange24h > 1 ? "bullish" : data.globalMarket.marketCapChange24h < -1 ? "bearish" : "neutral";
    const btcDom = data.globalMarket.btcDominance;

    let analysis = `The total crypto market cap is ${fmt(data.globalMarket.totalMarketCap)}, ${data.globalMarket.marketCapChange24h > 0 ? "up" : "down"} ${Math.abs(data.globalMarket.marketCapChange24h).toFixed(2)}% in the last 24 hours. `;

    if (btcDom > 55) {
      analysis += `BTC dominance at ${btcDom.toFixed(1)}% is elevated, suggesting capital is concentrated in Bitcoin rather than flowing into alts. This is typical of risk-off environments or early bull market phases where BTC leads. Alt season typically begins when dominance drops below 50%.`;
    } else if (btcDom > 45) {
      analysis += `BTC dominance at ${btcDom.toFixed(1)}% is in the normal range. Capital is somewhat balanced between BTC and alts, with neither extreme concentration nor alt-season dynamics.`;
    } else {
      analysis += `BTC dominance at ${btcDom.toFixed(1)}% is low, suggesting capital is rotating heavily into altcoins. This is characteristic of alt season — but also the phase where risk is highest as speculative excess builds.`;
    }

    sections.push({
      title: "Macro Pulse",
      emoji: "🔮",
      analysis,
      signal: mcSignal as "bullish" | "bearish" | "neutral",
      keyMetrics: [
        { label: "TOTAL MARKET CAP", value: fmt(data.globalMarket.totalMarketCap), signal: mcSignal as "bullish" | "bearish" | "neutral" },
        { label: "24H VOLUME", value: fmt(data.globalMarket.totalVolume24h), signal: "neutral" },
        { label: "BTC DOMINANCE", value: `${btcDom.toFixed(1)}%`, signal: btcDom > 55 ? "bearish" : "neutral" },
        { label: "ETH DOMINANCE", value: `${data.globalMarket.ethDominance.toFixed(1)}%`, signal: "neutral" },
      ],
    });
  }

  // Key takeaways
  const keyTakeaways: string[] = [];
  if (fg < 25) keyTakeaways.push(`🔴 Extreme Fear (${fg}/100) — historically a buying opportunity, but confirm with volume`);
  if (fg > 75) keyTakeaways.push(`🟡 Extreme Greed (${fg}/100) — caution warranted, consider taking profits`);
  if (dexChange > 10) keyTakeaways.push(`🟢 DEX volume surging +${dexChange.toFixed(0)}% weekly — strong onchain conviction`);
  if (dexChange < -10) keyTakeaways.push(`🔴 DEX volume declining ${dexChange.toFixed(0)}% weekly — waning interest`);
  if (tvlChange > 3) keyTakeaways.push(`🟢 TVL growing +${tvlChange.toFixed(1)}% this week — capital flowing into DeFi`);
  if (tvlChange < -3) keyTakeaways.push(`🔴 TVL declining ${tvlChange.toFixed(1)}% this week — capital leaving DeFi`);
  if (data.stablecoins && data.stablecoins.change24h > 0.01) keyTakeaways.push(`🟢 Fresh stablecoins minted — new capital entering the system`);
  if (data.globalMarket && data.globalMarket.btcDominance > 57) keyTakeaways.push(`🟡 BTC dominance high at ${data.globalMarket.btcDominance.toFixed(1)}% — alts underperforming`);
  if (mcChange > 2) keyTakeaways.push(`🟢 Market cap up ${mcChange.toFixed(1)}% in 24h — strong momentum`);
  if (mcChange < -2) keyTakeaways.push(`🔴 Market cap down ${Math.abs(mcChange).toFixed(1)}% in 24h — selling pressure`);

  if (keyTakeaways.length === 0) keyTakeaways.push(`🟡 Market in consolidation — no strong directional signals`);

  // Risk factors
  const riskFactors: string[] = [];
  if (fg < 20) riskFactors.push("Extreme fear can lead to capitulation cascades");
  if (fg > 80) riskFactors.push("Extreme greed often precedes sharp corrections");
  if (dexChange < -5) riskFactors.push("Declining volume suggests weakening conviction");
  if (tvlChange < -2) riskFactors.push("Capital outflows from DeFi may accelerate");
  if (data.globalMarket && data.globalMarket.btcDominance > 58) riskFactors.push("High BTC dominance = alt underperformance risk");
  riskFactors.push("Macro events (Fed, regulations) can override onchain signals");
  riskFactors.push("This analysis uses free public data — whale/smart money data requires premium sources");

  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
    " — " + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' }) + " PST";

  return {
    id: `brief-${now.toISOString().slice(0, 10)}`,
    timestamp,
    compositeScore,
    sentiment,
    headline,
    tldr,
    sections,
    keyTakeaways,
    riskFactors,
  };
}
