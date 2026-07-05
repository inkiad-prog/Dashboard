import {
  getWheatData,
  getCoalData,
  getSoybeanData,
  getMaizeData,
} from "@/lib/queries";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic"; // never cache — always query the DW live

export default async function Home() {
  const [wheat, coal, soybean, maize] = await Promise.all([
    getWheatData(),
    getCoalData(),
    getSoybeanData(),
    getMaizeData(),
  ]);

  const generatedAt = new Date().toISOString();

  return (
    <DashboardClient
      wheat={wheat}
      coal={coal}
      soybean={soybean}
      maize={maize}
      generatedAt={generatedAt}
    />
  );
}
