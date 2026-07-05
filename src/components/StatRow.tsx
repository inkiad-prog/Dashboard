"use client";

export interface Stat {
  label: string;
  value: string;
  sub: string;
  subClass?: "good" | "bad";
}

export default function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="stat-row">
      {stats.map((s) => (
        <div className="stat-tile" key={s.label}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className={`stat-sub${s.subClass ? ` ${s.subClass}` : ""}`}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
