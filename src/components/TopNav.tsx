"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMMODITIES } from "@/lib/commodities";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Link href="/" prefetch={false} className="top-nav-brand">
          📦 DW Commodity Dashboard
        </Link>
        <nav className="top-nav-links">
          <Link
            href="/"
            prefetch={false}
            className={`top-nav-link${pathname === "/" ? " active" : ""}`}
          >
            Overview
          </Link>
          {COMMODITIES.map((c) => {
            const href = `/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                prefetch={false}
                className={`top-nav-link${active ? " active" : ""}`}
                style={{ ["--link-accent" as string]: `var(${c.accent})` }}
              >
                <span className="icon">{c.icon}</span> {c.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
