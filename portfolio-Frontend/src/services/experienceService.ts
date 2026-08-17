import { api, USE_MOCKS, mockDelay } from "./api";
import { mockExperience } from "../data/mock/experience";
import type { Experience } from "../types";

let localExperience = [...mockExperience];

export const experienceService = {
  async getExperience(): Promise<Experience[]> {
    if (USE_MOCKS) return mockDelay([...localExperience], 450);
    return api.get<Experience[]>("/experience");
  },

  async createExperience(item: Omit<Experience, "id">): Promise<Experience> {
    if (USE_MOCKS) {
      const created = { ...item, id: Date.now() };
      localExperience = [created, ...localExperience];
      return mockDelay(created, 400);
    }
    return api.post<Experience>("/experience", item, { auth: true });
  },

  async updateExperience(id: number, item: Partial<Experience>): Promise<Experience> {
    if (USE_MOCKS) {
      localExperience = localExperience.map((e) => (e.id === id ? { ...e, ...item } : e));
      return mockDelay(localExperience.find((e) => e.id === id)!, 400);
    }
    return api.put<Experience>(`/experience/${id}`, item, { auth: true });
  },

  async deleteExperience(id: number): Promise<void> {
    if (USE_MOCKS) {
      localExperience = localExperience.filter((e) => e.id !== id);
      return mockDelay(undefined, 300);
    }
    return api.delete<void>(`/experience/${id}`, { auth: true });
  },
};
