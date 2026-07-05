"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommodityData } from "@/lib/queries";
import CommodityTab from "./CommodityTab";

const TABS = [
  { key: "wheat", label: "Wheat", title: "Wheat Import Analysis" },
  { key: "coal", label: "Coal", title: "Coal Import Analysis" },
  { key: "soybean", label: "Soybean", title: "Soybean Import Analysis" },
  { key: "maize", label: "Maize/Corn", title: "Maize/Corn Import Analysis" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function DashboardClient({
  wheat,
  coal,
  soybean,
  maize,
  generatedAt,
}: {
  wheat: CommodityData;
  coal: CommodityData;
  soybean: CommodityData;
  maize: CommodityData;
  generatedAt: string;
}) {
  const [active, setActive] = useState<TabKey>("wheat");
  const activeTab = TABS.find((t) => t.key === active)!;
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <div className="viz-root">
      <h1>{activeTab.title}</h1>
      <div className="subtitle" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span>
          Source: dbo.tblImportData — Bangladesh customs bill-of-entry
          records. Live query at page load ({generatedAt}).
        </span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="tab-btn"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "4px 10px",
            marginBottom: 0,
            opacity: isRefreshing ? 0.6 : 1,
          }}
        >
          {isRefreshing ? "Refreshing…" : "↻ Refresh data"}
        </button>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn${active === t.key ? " active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "wheat" && (
        <CommodityTab commodityLabel="Wheat" data={wheat} />
      )}
      {active === "coal" && <CommodityTab commodityLabel="Coal" data={coal} />}
      {active === "soybean" && (
        <CommodityTab
          commodityLabel="Soybean"
          data={soybean}
          priceNote="excludes non-bulk shipments under 100 MT (pharma/industrial imports misclassified under this category)"
        />
      )}
      {active === "maize" && (
        <CommodityTab
          commodityLabel="Maize/Corn"
          data={maize}
          priceNote="excludes non-bulk shipments under 100 MT (e.g. pet food, unrelated goods misclassified under this category)"
        />
      )}
    </div>
  );
}
