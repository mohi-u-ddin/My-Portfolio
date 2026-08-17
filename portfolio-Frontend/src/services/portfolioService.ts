import { api, USE_MOCKS, mockDelay } from "./api";
import { mockProfile } from "../data/mock/profile";
import type { Profile } from "../types";

export const portfolioService = {
  async getProfile(): Promise<Profile> {
    if (USE_MOCKS) return mockDelay(mockProfile, 400);
    return api.get<Profile>("/portfolio");
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    if (USE_MOCKS) return mockDelay({ ...mockProfile, ...profile }, 500);
    return api.put<Profile>("/portfolio", profile, { auth: true });
  },
};
