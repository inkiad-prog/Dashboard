import { getLentilData } from "@/lib/queries";
import { getCommodityBySlug } from "@/lib/commodities";
import PageHeader from "@/components/PageHeader";
import CommodityTab from "@/components/CommodityTab";

export const dynamic = "force-static";
export const revalidate = false;

export default async function LentilPage() {
  const meta = getCommodityBySlug("lentil")!;
  const data = await getLentilData();
  return (
    <>
      <PageHeader
        icon={meta.icon}
        title={meta.label}
        category={meta.category}
        accent={meta.accent}
      />
      <div className="page-content">
        <CommodityTab commodityLabel={meta.label} data={data} accent={meta.accent} />
      </div>
    </>
  );
}
