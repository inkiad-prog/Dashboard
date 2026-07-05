"use client";

import { useState } from "react";

export interface PricePoint {
  label: string; // e.g. "2024-06"
  price: number;
}

export default function PriceLineChart({
  data,
  color = "var(--series-1)",
}: {
  data: PricePoint[];
  color?: string;
}) {
  const W = 1160,
    H = 260,
    padL = 55,
    padR = 20,
    padT = 15,
    padB = 30;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const values = data.map((d) => d.price);
  const maxV = Math.max(...values) * 1.08;
  const minV = Math.min(...values) * 0.92;
  const n = data.length;
  const [hover, setHover] = useState<number | null>(null);
  const gradId = "priceAreaGrad";

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
  const areaPath =
    data.length > 0
      ? `${path} L${xPos(n - 1)},${padT + plotH} L${xPos(0)},${padT + plotH} Z`
      : "";

  // thin year labels shown at Jan of each year
  const yearLabels = data
    .map((d, i) => ({ ...d, i }))
    .filter((d) => d.label.endsWith("-01"));

  return (
    <div style={{ position: "relative" }}>
      <svg
        width="100%"
        height="260"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
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
        {yearLabels.map((d) => (
          <text
            key={d.label}
            x={xPos(d.i)}
            y={padT + plotH + 20}
            textAnchor="middle"
          >
            {d.label.slice(0, 4)}
          </text>
        ))}
        {areaPath && <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />}
        <path d={path} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" />
        {hover !== null && (
          <circle cx={xPos(hover)} cy={yPos(data[hover].price)} r={4.5} fill={color} stroke="var(--surface-1)" strokeWidth={2} />
        )}
        {data.map((d, i) => (
          <circle
            key={d.label}
            cx={xPos(i)}
            cy={yPos(d.price)}
            r={7}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover !== null && (
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
