export function diff(a, b) {
  const diff = b - a;
  const pct = (b - a) / a;
  const diffFormatted = Number(
    Math.round(diff.toLocaleString("en-sg") + "e2").toString() + "e-2"
  );
  const pctDiff = Number(
    Math.round(pct.toLocaleString("en-sg") + "e4").toString() + "e-2"
  );
  const symbol = diffFormatted < 0 ? "" : "+";
  return {
    diff: symbol + diffFormatted.toFixed(2),
    pctDiff: symbol + pctDiff.toFixed(2) + "%",
  };
}

export function getCurrentMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth());
}
