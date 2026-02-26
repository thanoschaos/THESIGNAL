import { fetchAllSignalData, calculateScores } from "@/lib/api";
import Dashboard from "@/components/Dashboard";

export const revalidate = 300; // Revalidate every 5 min

export default async function Home() {
  const rawData = await fetchAllSignalData();
  const scores = calculateScores(rawData);

  return <Dashboard rawData={rawData} scores={scores} />;
}
