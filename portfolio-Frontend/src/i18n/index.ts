import en from "./en";
import ur from "./ur";
import type { Locale } from "../types";

export const dictionaries = { en, ur } as const;

export const localeMeta: Record<Locale, { label: string; dir: "ltr" | "rtl"; nativeLabel: string }> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  ur: { label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
};

export type Dictionary = typeof en;
export default dictionaries;
