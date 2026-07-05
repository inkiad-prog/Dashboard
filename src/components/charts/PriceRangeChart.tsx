"use client";

import { useMemo, useState } from "react";
import PriceLineChart, { PricePoint } from "./PriceLineChart";
import { DailyPriceRow } from "@/lib/queries";

const RANGES = [
  { key: "30d", label: "30 Days", days: 30 },
  { key: "60d", label: "60 Days", days: 60 },
  { key: "6m", label: "6 Months", days: 182 },
  { key: "1y", label: "1 Year", days: 365 },
  { key: "2y", label: "2 Years", days: 730 },
  { key: "5y", label: "5 Years", days: 1826 },
  { key: "all", label: "All", days: Infinity },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

export default function PriceRangeChart({
  dailyPrice,
}: {
  dailyPrice: DailyPriceRow[];
}) {
  const [range, setRange] = useState<RangeKey>("1y");

  const clean = useMemo(
    () =>
      dailyPrice
        .filter((d) => d.AvgPricePerMT != null)
        .map((d) => ({ label: d.Date, price: d.AvgPricePerMT as number }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [dailyPrice]
  );

  const filtered: PricePoint[] = useMemo(() => {
    if (clean.length === 0) return [];
    const rangeDef = RANGES.find((r) => r.key === range)!;
    if (rangeDef.days === Infinity) return clean;
    const lastDate = new Date(clean[clean.length - 1].label);
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - rangeDef.days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return clean.filter((d) => d.label >= cutoffStr);
  }, [clean, range]);

  return (
    <div>
      <div className="tab-bar" style={{ marginBottom: 12, border: "none" }}>
        {RANGES.map((r) => (
          <button
            key={r.key}
            className={`tab-btn${range === r.key ? " active" : ""}`}
            onClick={() => setRange(r.key)}
            style={{ fontSize: 12.5, padding: "5px 12px" }}
          >
            {r.label}
          </button>
        ))}
      </div>
      {filtered.length > 0 ? (
        <PriceLineChart data={filtered} />
      ) : (
        <p style={{ color: "var(--text-secondary)" }}>
          No transactions recorded in this range.
        </p>
      )}
    </div>
  );
}
