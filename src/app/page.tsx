import { fetchAllSignalData, calculateScores } from "@/lib/api";
import { fetchDerivativesData, getDerivativesMetrics } from "@/lib/derivatives";
import Dashboard from "@/components/Dashboard";

export const revalidate = 300;

export default async function Home() {
  const [rawData, derivativesData] = await Promise.all([
    fetchAllSignalData(),
    fetchDerivativesData(),
  ]);
  const scores = calculateScores(rawData);
  const derivatives = derivativesData ? getDerivativesMetrics(derivativesData) : null;

  return <Dashboard rawData={rawData} scores={scores} derivatives={derivatives} />;
}
