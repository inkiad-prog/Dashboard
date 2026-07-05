"use client";

import { CommodityData } from "@/lib/queries";
import YearlyBarChart from "./charts/YearlyBarChart";
import PriceLineChart from "./charts/PriceLineChart";
import HBarList from "./charts/HBarList";
import StatRow, { Stat } from "./StatRow";

const MONTH_NUM: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function fmtMT(n: number) {
  return (n / 1e6).toFixed(2) + "M MT";
}
function fmtBn(n: number) {
  return "Tk. " + (n / 1e9).toFixed(1) + "B";
}

export default function CommodityTab({
  commodityLabel,
  data,
  priceNote,
  accent = "--cat-grains",
}: {
  commodityLabel: string;
  data: CommodityData;
  priceNote?: string;
  accent?: string;
}) {
  const accentVar = `var(${accent})`;
  const yearly = data.yearly.map((d) => ({ year: d.Year, mt: d.TotalMT }));
  const totalMT = yearly.reduce((s, d) => s + d.mt, 0);
  const totalVal = data.yearly.reduce((s, d) => s + d.TotalValueTK, 0);

  const years = data.yearly.map((d) => d.Year).sort();
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const latestRow = data.yearly.find((d) => d.Year === latestYear);
  const prevRow = data.yearly.find((d) => d.Year === prevYear);
  const yoy =
    latestRow && prevRow && prevRow.TotalMT > 0
      ? (((latestRow.TotalMT - prevRow.TotalMT) / prevRow.TotalMT) * 100).toFixed(1)
      : "0.0";
  const yoyPositive = Number(yoy) > 0;

  const priceSeries = data.monthlyPrice
    .filter((p) => p.AvgPricePerMT != null)
    .map((p) => ({
      label: `${p.Year}-${String(MONTH_NUM[p.Month] ?? 0).padStart(2, "0")}`,
      price: p.AvgPricePerMT as number,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const peak = priceSeries.reduce(
    (a, b) => (b.price > a.price ? b : a),
    priceSeries[0] ?? { label: "-", price: 0 }
  );

  const topCountry = data.countries[0];

  const stats: Stat[] = [
    {
      label: `Total Volume (${years[0]}–${latestYear})`,
      value: fmtMT(totalMT),
      sub: `${years.length} years of records`,
    },
    {
      label: "Total Assessed Value",
      value: fmtBn(totalVal),
      sub: `${commodityLabel}, ${years[0]}–${latestYear}`,
    },
    {
      label: `Volume YoY (${prevYear}→${latestYear})`,
      value: (yoyPositive ? "+" : "") + yoy + "%",
      sub: yoyPositive ? "Growth" : "Decline",
      subClass: yoyPositive ? "good" : "bad",
    },
    {
      label: "Peak Avg. Price / MT",
      value: "Tk. " + Math.round(peak.price).toLocaleString(),
      sub: peak.label,
    },
    {
      label: "Top Origin Country",
      value: topCountry?.Origin ?? "-",
      sub: topCountry
        ? `${(topCountry.TotalMT / 1e6).toFixed(2)}M MT`
        : "",
    },
  ];

  return (
    <div style={{ ["--accent" as string]: accentVar }}>
      <StatRow stats={stats} />

      <div className="panel">
        <div className="panel-title">Annual import volume</div>
        <div className="panel-sub">
          {commodityLabel} — metric tons imported per year (live from data
          warehouse)
        </div>
        <YearlyBarChart data={yearly} color={accentVar} />
      </div>

      <div className="panel">
        <div className="panel-title">Monthly average unit price — {commodityLabel}</div>
        <div className="panel-sub">
          Assessed value ÷ quantity (Tk. per metric ton)
          {priceNote ? ` — ${priceNote}` : ""}
        </div>
        {priceSeries.length > 0 ? (
          <PriceLineChart data={priceSeries} color={accentVar} />
        ) : (
          <p style={{ color: "var(--text-secondary)" }}>No price data available.</p>
        )}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Top countries of origin — {commodityLabel}</div>
          <div className="panel-sub">Ranked by total metric tons imported</div>
          <HBarList
            data={data.countries.map((c) => ({ name: c.Origin, mt: c.TotalMT }))}
            colorVar={accentVar}
          />
        </div>
        <div className="panel">
          <div className="panel-title">Top importers — {commodityLabel}</div>
          <div className="panel-sub">
            Ranked by total metric tons imported, using the source system&apos;s
            Importer Name_Clean field as-is
          </div>
          <HBarList
            data={data.importers.map((i) => ({ name: i.ImporterName, mt: i.TotalMT }))}
            colorVar="var(--series-2)"
          />
        </div>
      </div>
    </div>
  );
}
