"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMMODITIES, CATEGORY_ORDER } from "@/lib/commodities";

const STORAGE_KEY = "sidebar-collapsed";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    setMounted(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <nav className={`sidebar${collapsed ? " collapsed" : ""}${mounted ? "" : " no-transition"}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">📦</div>
        {!collapsed && (
          <div>
            <div className="sidebar-brand-text">DW Commodity Dashboard</div>
            <div className="sidebar-brand-sub">Live from SSISRND</div>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <Link
        href="/"
        prefetch={false}
        title="Overview"
        className={`sidebar-link sidebar-overview-link${pathname === "/" ? " active" : ""}`}
        style={{ ["--link-accent" as string]: "var(--cat-grains)" }}
      >
        <span className="icon">🏠</span> {!collapsed && "Overview"}
      </Link>

      {CATEGORY_ORDER.map((category) => {
        const items = COMMODITIES.filter((c) => c.category === category);
        return (
          <div key={category}>
            {!collapsed && <div className="sidebar-group-label">{category}</div>}
            {items.map((c) => {
              const href = `/${c.slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={c.slug}
                  href={href}
                  prefetch={false}
                  title={c.label}
                  className={`sidebar-link${active ? " active" : ""}`}
                  style={{ ["--link-accent" as string]: `var(${c.accent})` }}
                >
                  <span className="icon">{c.icon}</span> {!collapsed && c.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
