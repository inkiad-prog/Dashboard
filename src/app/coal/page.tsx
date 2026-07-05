import { getCoalData } from "@/lib/queries";
import { getCommodityBySlug } from "@/lib/commodities";
import PageHeader from "@/components/PageHeader";
import CommodityTab from "@/components/CommodityTab";

export const dynamic = "force-dynamic";

export default async function CoalPage() {
  const meta = getCommodityBySlug("coal")!;
  const data = await getCoalData();
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
        <CommodityTab commodityLabel={meta.label} data={data} accent={meta.accent} />
      </div>
    </>
  );
}
