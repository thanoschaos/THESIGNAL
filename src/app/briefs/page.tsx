import { fetchAllSignalData, calculateScores } from "@/lib/api";
import { fetchDerivativesData, getDerivativesMetrics } from "@/lib/derivatives";
import { generateBrief } from "@/lib/analysis";
import BriefsPage from "@/components/BriefsPage";

export const revalidate = 300;

export default async function Briefs() {
  const [rawData, derivativesData] = await Promise.all([
    fetchAllSignalData(),
    fetchDerivativesData(),
  ]);
  const scores = calculateScores(rawData);
  
  // Add derivatives score
  if (derivativesData) {
    const deriv = getDerivativesMetrics(derivativesData);
    scores["Leverage"] = {
      score: deriv.score,
      metrics: deriv.metrics.map(m => ({ ...m, signal: m.signal })),
    };
  }

  const brief = generateBrief(rawData, scores);

  return <BriefsPage brief={brief} />;
}
