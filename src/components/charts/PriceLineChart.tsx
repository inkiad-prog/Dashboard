"use client";

import { useState } from "react";

export interface PricePoint {
  label: string; // "YYYY-MM" (monthly) or "YYYY-MM-DD" (daily)
  price: number;
}

export default function PriceLineChart({ data }: { data: PricePoint[] }) {
  const W = 1160,
    H = 260,
    padL = 55,
    padR = 20,
    padT = 15,
    padB = 30;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const values = data.map((d) => d.price);
  const maxV = data.length ? Math.max(...values) * 1.08 : 1;
  const minV = data.length ? Math.min(...values) * 0.92 : 0;
  const n = data.length;
  const [hover, setHover] = useState<number | null>(null);

  function xPos(i: number) {
    return n > 1 ? padL + (i / (n - 1)) * plotW : padL + plotW / 2;
  }
  function yPos(v: number) {
    return padT + plotH - ((v - minV) / (maxV - minV)) * plotH;
  }

  const ticks = 4;
  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(d.price)}`)
    .join(" ");

  // Dynamically thin x-axis labels to whatever the plot width allows,
  // works whether labels are monthly ("YYYY-MM") or daily ("YYYY-MM-DD").
  const marks: { text: string; i: number }[] = [];
  let lastKey = "";
  data.forEach((d, i) => {
    const key = data[0]?.label.length > 7 ? d.label : d.label.slice(0, 7); // group by month if daily
    if (key !== lastKey) {
      lastKey = key;
      marks.push({ text: d.label.length > 7 ? d.label.slice(0, 7) : d.label, i });
    }
  });
  const minLabelGapPx = 62;
  const maxLabels = Math.max(1, Math.floor(plotW / minLabelGapPx));
  const step = Math.max(1, Math.ceil(marks.length / maxLabels));
  const shownMarks = marks.filter((_, idx) => idx % step === 0);

  const colW = n > 1 ? plotW / n : plotW;

  return (
    <div style={{ position: "relative" }}>
      <svg
        width="100%"
        height="260"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMinYMin meet"
      >
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const val = minV + ((maxV - minV) / ticks) * i;
          const y = padT + plotH - (i / ticks) * plotH;
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
                {Math.round(val).toLocaleString()}
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
        {shownMarks.map((m) => (
          <text
            key={m.i}
            x={xPos(m.i)}
            y={padT + plotH + 20}
            textAnchor="middle"
          >
            {m.text}
          </text>
        ))}
        <path d={path} fill="none" stroke="var(--series-1)" strokeWidth={2} />
        {n <= 80 &&
          data.map((d, i) => (
            <circle
              key={d.label}
              cx={xPos(i)}
              cy={yPos(d.price)}
              r={3}
              fill="var(--series-1)"
            />
          ))}
        {data.map((d, i) => (
          <rect
            key={d.label}
            x={xPos(i) - colW / 2}
            y={padT}
            width={colW}
            height={plotH}
            fill="transparent"
            style={{ cursor: "crosshair" }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover !== null && data[hover] && (
        <div
          className="tooltip"
          style={{
            opacity: 1,
            left: `${(xPos(hover) / W) * 100}%`,
            top: `${(yPos(data[hover].price) / H) * 100}%`,
            position: "absolute",
            transform: "translate(12px, -30px)",
          }}
        >
          <strong>{data[hover].label}</strong>
          <br />
          Tk. {data[hover].price.toLocaleString(undefined, { maximumFractionDigits: 0 })} / MT
        </div>
      )}
    </div>
  );
}
