import { api, USE_MOCKS, mockDelay } from "./api";
import { mockTranslations } from "../data/mock/translations";
import type { TranslationEntry } from "../types";

let localTranslations = [...mockTranslations];

export const translationService = {
  async getTranslations(): Promise<TranslationEntry[]> {
    if (USE_MOCKS) return mockDelay([...localTranslations], 350);
    return api.get<TranslationEntry[]>("/translations");
  },

  async updateTranslations(entries: TranslationEntry[]): Promise<TranslationEntry[]> {
    if (USE_MOCKS) {
      localTranslations = entries;
      return mockDelay([...localTranslations], 400);
    }
    return api.put<TranslationEntry[]>("/translations", entries, { auth: true });
  },
};
