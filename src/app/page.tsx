import {
  getWheatData,
  getCoalData,
  getSoybeanData,
  getMaizeData,
  getYellowPeasData,
  getChickpeasData,
  getCanolaSeedData,
} from "@/lib/queries";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic"; // never cache — always query the DW live

export default async function Home() {
  const [wheat, coal, soybean, maize, yellowPeas, chickpeas, canolaSeed] =
    await Promise.all([
      getWheatData(),
      getCoalData(),
      getSoybeanData(),
      getMaizeData(),
      getYellowPeasData(),
      getChickpeasData(),
      getCanolaSeedData(),
    ]);

  const generatedAt = new Date().toISOString();

  return (
    <DashboardClient
      wheat={wheat}
      coal={coal}
      soybean={soybean}
      maize={maize}
      yellowPeas={yellowPeas}
      chickpeas={chickpeas}
      canolaSeed={canolaSeed}
      generatedAt={generatedAt}
    />
  );
}
