import { fetchAllSignalData, calculateScores } from "@/lib/api";
import { generateBrief } from "@/lib/analysis";
import BriefsPage from "@/components/BriefsPage";

export const revalidate = 300;

export default async function Briefs() {
  const rawData = await fetchAllSignalData();
  const scores = calculateScores(rawData);
  const brief = generateBrief(rawData, scores);

  return <BriefsPage brief={brief} />;
}
