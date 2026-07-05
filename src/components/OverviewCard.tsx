import Link from "next/link";
import Sparkline from "./charts/Sparkline";
import { CommodityMeta } from "@/lib/commodities";

export interface OverviewCardData {
  totalMT: number;
  yoy: number;
  topCountry: string;
  topCountryMT: number;
  sparkValues: number[];
}

function fmtMT(n: number) {
  return (n / 1e6).toFixed(2) + "M MT";
}

export default function OverviewCard({
  meta,
  data,
}: {
  meta: CommodityMeta;
  data: OverviewCardData;
}) {
  const positive = data.yoy >= 0;
  return (
    <Link
      href={`/${meta.slug}`}
      prefetch={false}
      className="commodity-card"
      style={{
        ["--accent" as string]: `var(${meta.accent})`,
        ["--accent-soft" as string]: `var(${meta.accent}-soft)`,
      }}
    >
      <div className="commodity-card-head">
        <div className="commodity-card-icon">{meta.icon}</div>
        <div>
          <div className="commodity-card-title">{meta.label}</div>
          <div className="commodity-card-category">{meta.category}</div>
        </div>
      </div>

      <div className="commodity-card-sparkline">
        <Sparkline values={data.sparkValues} color={`var(${meta.accent})`} />
      </div>

      <div className="commodity-card-stats">
        <div>
          <div className="commodity-card-volume-label">Total Volume</div>
          <div className="commodity-card-volume">{fmtMT(data.totalMT)}</div>
        </div>
        <div className={`yoy-badge ${positive ? "good" : "bad"}`}>
          {positive ? "+" : ""}
          {data.yoy.toFixed(1)}% YoY
        </div>
      </div>

      <div className="commodity-card-footer">
        <span>Top origin: {data.topCountry}</span>
        <span>{fmtMT(data.topCountryMT)}</span>
      </div>
    </Link>
  );
}
