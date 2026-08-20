import { api, USE_MOCKS, mockDelay } from "./api";
import { mockProfile } from "../data/mock/profile";
import type { Profile } from "../types";

let localProfile: Profile = { ...mockProfile };

export const portfolioService = {
  async getProfile(): Promise<Profile> {
    if (USE_MOCKS) return mockDelay({ ...localProfile }, 300);
    return api.get<Profile>("/portfolio");
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    if (USE_MOCKS) {
      localProfile = { ...localProfile, ...profile };
      return mockDelay({ ...localProfile }, 400);
    }
    return api.put<Profile>("/portfolio", profile, { auth: true });
  },
};

