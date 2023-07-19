export function diff(a, b) {
  const diff = b - a;
  const pct = (b - a) / a;
  const diffFormatted = Number(
    Math.round(diff.toString() + "e2").toString() + "e-2"
  ).toFixed(2);
  const pctDiff = Number(
    Math.round(pct.toString() + "e4").toString() + "e-2"
  ).toFixed(2);
  const symbol = b - a < 0 ? "" : "+";
  return { diff: symbol + diffFormatted, pctDiff: symbol + pctDiff + "%" };
}
