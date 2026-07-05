import {
  getWheatData,
  getCoalData,
  getSoybeanData,
  getMaizeData,
  getYellowPeasData,
  getChickpeasData,
  getCanolaSeedData,
  getLentilData,
  CommodityData,
} from "@/lib/queries";
import { COMMODITIES } from "@/lib/commodities";
import OverviewCard, { OverviewCardData } from "@/components/OverviewCard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FETCHERS: Record<string, () => Promise<CommodityData>> = {
  wheat: getWheatData,
  coal: getCoalData,
  soybean: getSoybeanData,
  maize: getMaizeData,
  "yellow-peas": getYellowPeasData,
  chickpeas: getChickpeasData,
  "canola-seed": getCanolaSeedData,
  lentil: getLentilData,
};

function buildCardData(data: CommodityData): OverviewCardData {
  const totalMT = data.yearly.reduce((s, d) => s + d.TotalMT, 0);
  const years = data.yearly.map((d) => d.Year).sort();
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const latestRow = data.yearly.find((d) => d.Year === latestYear);
  const prevRow = data.yearly.find((d) => d.Year === prevYear);
  const yoy =
    latestRow && prevRow && prevRow.TotalMT > 0
      ? ((latestRow.TotalMT - prevRow.TotalMT) / prevRow.TotalMT) * 100
      : 0;
  const topCountry = data.countries[0];
  const sparkValues = data.monthlyPrice
    .filter((p) => p.AvgPricePerMT != null)
    .slice(-24)
    .map((p) => p.AvgPricePerMT as number);

  return {
    totalMT,
    yoy,
    topCountry: topCountry?.Origin ?? "-",
    topCountryMT: topCountry?.TotalMT ?? 0,
    sparkValues,
  };
}

export default async function OverviewPage() {
  const entries = await Promise.all(
    COMMODITIES.map(async (meta) => {
      const data = await FETCHERS[meta.slug]();
      return { meta, card: buildCardData(data) };
    })
  );

  return (
    <>
      <div className="overview-hero">
        <h1>Commodity Import Overview</h1>
        <p>
          Live snapshot across all tracked commodities, queried fresh from
          dbo.tblImportData on every page load. Click any card to open its
          full analysis — volume trend, price history, top countries, and top
          importers.
        </p>
      </div>
      <div className="overview-grid">
        {entries.map(({ meta, card }) => (
          <OverviewCard key={meta.slug} meta={meta} data={card} />
        ))}
      </div>
    </>
  );
}
