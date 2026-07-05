"use client";

export interface YearlyDatum {
  year: string;
  mt: number;
}

export default function YearlyBarChart({ data }: { data: YearlyDatum[] }) {
  const W = 1160,
    H = 280,
    padL = 60,
    padR = 20,
    padT = 10,
    padB = 30;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const maxMT = Math.max(...data.map((d) => d.mt), 1) * 1.15;
  const n = data.length;
  const groupW = plotW / n;
  const barW = groupW * 0.45;
  const ticks = 5;

  return (
    <svg
      width="100%"
      height="280"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMinYMin meet"
    >
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const val = (maxMT / ticks) * i;
        const y = padT + plotH - (val / maxMT) * plotH;
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              className="grid-line"
            />
            <text x={padL - 8} y={y + 3} textAnchor="end">
              {(val / 1e6).toFixed(1)}M
            </text>
          </g>
        );
      })}
      <line
        x1={padL}
        y1={padT + plotH}
        x2={W - padR}
        y2={padT + plotH}
        className="axis-line"
      />
      {data.map((d, i) => {
        const gx = padL + i * groupW + groupW / 2;
        const h = (d.mt / maxMT) * plotH;
        const x = gx - barW / 2;
        const y = padT + plotH - h;
        return (
          <g key={d.year}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={3}
              fill="var(--series-1)"
            />
            <text
              x={gx}
              y={y - 8}
              textAnchor="middle"
              style={{ fill: "var(--text-secondary)", fontWeight: 600 }}
            >
              {(d.mt / 1e6).toFixed(2)}M
            </text>
            <text x={gx} y={padT + plotH + 20} textAnchor="middle">
              {d.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
