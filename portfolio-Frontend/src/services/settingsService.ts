import { api, USE_MOCKS, mockDelay } from "./api";
import { mockSettings } from "../data/mock/settings";
import type { SiteSettings } from "../types";

let localSettings = { ...mockSettings };

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (USE_MOCKS) return mockDelay({ ...localSettings }, 350);
    return api.get<SiteSettings>("/settings");
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (USE_MOCKS) {
      localSettings = { ...localSettings, ...settings };
      return mockDelay({ ...localSettings }, 400);
    }
    return api.put<SiteSettings>("/settings", settings, { auth: true });
  },
};
