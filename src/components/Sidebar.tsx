"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMMODITIES, CATEGORY_ORDER } from "@/lib/commodities";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">📦</div>
        <div>
          <div className="sidebar-brand-text">DW Commodity Dashboard</div>
          <div className="sidebar-brand-sub">Live from SSISRND</div>
        </div>
      </div>

      <Link
        href="/"
        className={`sidebar-link sidebar-overview-link${pathname === "/" ? " active" : ""}`}
        style={{ ["--link-accent" as string]: "var(--cat-grains)" }}
      >
        <span className="icon">🏠</span> Overview
      </Link>

      {CATEGORY_ORDER.map((category) => {
        const items = COMMODITIES.filter((c) => c.category === category);
        return (
          <div key={category}>
            <div className="sidebar-group-label">{category}</div>
            {items.map((c) => {
              const href = `/${c.slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={c.slug}
                  href={href}
                  className={`sidebar-link${active ? " active" : ""}`}
                  style={{ ["--link-accent" as string]: `var(${c.accent})` }}
                >
                  <span className="icon">{c.icon}</span> {c.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
