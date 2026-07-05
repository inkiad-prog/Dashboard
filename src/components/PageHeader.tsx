"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PageHeader({
  icon,
  title,
  category,
  accent,
  generatedAt,
}: {
  icon: string;
  title: string;
  category: string;
  accent: string;
  generatedAt: string;
}) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  return (
    <div className="page-header" style={{ ["--accent" as string]: `var(${accent})` }}>
      <div className="page-header-eyebrow">{category}</div>
      <h1>
        <span>{icon}</span> {title}
      </h1>
      <div
        className="subtitle"
        style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
      >
        <span>
          Source: dbo.tblImportData — Bangladesh customs bill-of-entry records.
          Live query at page load ({generatedAt}).
        </span>
        <button
          className="refresh-btn"
          disabled={isRefreshing}
          onClick={() => startRefresh(() => router.refresh())}
        >
          {isRefreshing ? "Refreshing…" : "↻ Refresh data"}
        </button>
      </div>
    </div>
  );
}
