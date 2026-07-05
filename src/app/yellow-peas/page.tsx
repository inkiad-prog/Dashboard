import { getYellowPeasData } from "@/lib/queries";
import { getCommodityBySlug } from "@/lib/commodities";
import PageHeader from "@/components/PageHeader";
import CommodityTab from "@/components/CommodityTab";

export const dynamic = "force-static";
export const revalidate = false;

export default async function YellowPeasPage() {
  const meta = getCommodityBySlug("yellow-peas")!;
  const data = await getYellowPeasData();
  return (
    <>
      <PageHeader
        icon={meta.icon}
        title={meta.label}
        category={meta.category}
        accent={meta.accent}
      />
      <div className="page-content">
        <CommodityTab
          commodityLabel={meta.label}
          data={data}
          accent={meta.accent}
          priceNote="Apr-Aug 2024 shows an unexplained ~3x price spike (Tk. 150-160K/MT vs. a normal ~45-60K range) consistent across many unrelated importers — likely a customs reference-valuation anomaly for that period rather than a data error, kept as-is but flagged"
        />
      </div>
    </>
  );
}
