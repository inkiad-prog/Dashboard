"use client";

import { useState } from "react";

export interface HBarDatum {
  name: string;
  mt: number;
}

export default function HBarList({
  data,
  colorVar,
}: {
  data: HBarDatum[];
  colorVar: string;
}) {
  const maxV = Math.max(...data.map((d) => d.mt), 1);
  const [hover, setHover] = useState<{ x: number; y: number; d: HBarDatum } | null>(
    null
  );

  return (
    <div style={{ position: "relative" }}>
      {data.map((d) => {
        const pct = (d.mt / maxV) * 100;
        return (
          <div
            key={d.name}
            className="hbar-row"
            onMouseEnter={(e) =>
              setHover({ x: e.clientX, y: e.clientY, d })
            }
            onMouseMove={(e) =>
              setHover({ x: e.clientX, y: e.clientY, d })
            }
            onMouseLeave={() => setHover(null)}
          >
            <div className="hbar-name">{d.name}</div>
            <div className="hbar-track">
              <div
                className="hbar-fill"
                style={{ width: `${pct}%`, background: colorVar }}
              />
            </div>
            <div className="hbar-value">{(d.mt / 1e6).toFixed(2)}M MT</div>
          </div>
        );
      })}
      {hover && (
        <div
          className="tooltip"
          style={{
            opacity: 1,
            position: "fixed",
            left: hover.x + 14,
            top: hover.y - 10,
          }}
        >
          <strong>{hover.d.name}</strong>
          <br />
          {hover.d.mt.toLocaleString(undefined, { maximumFractionDigits: 0 })} MT
        </div>
      )}
    </div>
  );
}
