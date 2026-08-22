import { bingoItems } from "@/data/bingo";

export type BingoSaved = Record<number, string>;

export function countBingoDone(saved: BingoSaved): number {
  return bingoItems.filter((item, i) => !item.pending || saved[i]).length;
}
