import { getWheatData, getCoalData, getSoybeanData } from "@/lib/queries";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic"; // never cache — always query the DW live

export default async function Home() {
  const [wheat, coal, soybean] = await Promise.all([
    getWheatData(),
    getCoalData(),
    getSoybeanData(),
  ]);

  const generatedAt = new Date().toISOString();

  return (
    <DashboardClient
      wheat={wheat}
      coal={coal}
      soybean={soybean}
      generatedAt={generatedAt}
    />
  );
}
