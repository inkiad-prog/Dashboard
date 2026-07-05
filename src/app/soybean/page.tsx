import { getSoybeanData } from "@/lib/queries";
import { getCommodityBySlug } from "@/lib/commodities";
import PageHeader from "@/components/PageHeader";
import CommodityTab from "@/components/CommodityTab";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function SoybeanPage() {
  const meta = getCommodityBySlug("soybean")!;
  const data = await getSoybeanData();
  const generatedAt = new Date().toISOString();

  return (
    <>
      <PageHeader
        icon={meta.icon}
        title={meta.label}
        category={meta.category}
        accent={meta.accent}
        generatedAt={generatedAt}
      />
      <div className="page-content">
        <CommodityTab
          commodityLabel={meta.label}
          data={data}
          accent={meta.accent}
          priceNote="excludes non-bulk shipments under 100 MT (pharma/industrial imports misclassified under this category)"
        />
      </div>
    </>
  );
}
