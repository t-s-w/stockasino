import { APIReturnGame } from "./types";

export function diff(a: number, b: number) {
  const diff = b - a;
  const pct = (b - a) / a;
  const diffFormatted = Number(
    Math.round(Number(diff.toLocaleString("en-sg") + "e2")).toString() + "e-2"
  );
  const pctDiff = Number(
    Math.round(Number(pct.toLocaleString("en-sg") + "e4")).toString() + "e-2"
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

export function parseGameInfo(game: APIReturnGame) {
  const newGame = {
    ...game,
    month: new Date(game.month),
    currentBalance: parseFloat(game.currentBalance),
  };
  return newGame;
}
