// Reference palette (light mode values; dark mode handled via CSS custom properties in globals.css)
export const SERIES = [
  "var(--series-1)", // blue
  "var(--series-2)", // aqua
  "var(--series-3)", // yellow
  "var(--series-4)", // violet
  "var(--series-5)", // green
  "var(--series-6)", // red
  "var(--series-7)", // magenta
];

export function sequentialBlue(t: number): string {
  // t in [0,1], light -> dark blue, matches the reference palette's sequential ramp
  const light = [205, 226, 251]; // #cde2fb
  const dark = [13, 54, 107]; // #0d366b
  const rgb = light.map((c, i) => Math.round(c + (dark[i] - c) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
