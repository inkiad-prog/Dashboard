import {
  getWheatData,
  getCoalData,
  getSoybeanData,
  getMaizeData,
  getYellowPeasData,
  getChickpeasData,
  getCanolaSeedData,
  getLentilData,
} from "@/lib/queries";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic"; // never cache — always query the DW live

export default async function Home() {
  const [wheat, coal, soybean, maize, yellowPeas, chickpeas, canolaSeed, lentil] =
    await Promise.all([
      getWheatData(),
      getCoalData(),
      getSoybeanData(),
      getMaizeData(),
      getYellowPeasData(),
      getChickpeasData(),
      getCanolaSeedData(),
      getLentilData(),
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
      lentil={lentil}
      generatedAt={generatedAt}
    />
  );
}
