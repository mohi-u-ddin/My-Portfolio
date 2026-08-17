import { api, USE_MOCKS, mockDelay } from "./api";
import { mockEducation } from "../data/mock/education";
import type { Education } from "../types";

let localEducation = [...mockEducation];

export const educationService = {
  async getEducation(): Promise<Education[]> {
    if (USE_MOCKS) return mockDelay([...localEducation], 450);
    return api.get<Education[]>("/education");
  },

  async createEducation(item: Omit<Education, "id">): Promise<Education> {
    if (USE_MOCKS) {
      const created = { ...item, id: Date.now() };
      localEducation = [created, ...localEducation];
      return mockDelay(created, 400);
    }
    return api.post<Education>("/education", item, { auth: true });
  },

  async updateEducation(id: number, item: Partial<Education>): Promise<Education> {
    if (USE_MOCKS) {
      localEducation = localEducation.map((e) => (e.id === id ? { ...e, ...item } : e));
      return mockDelay(localEducation.find((e) => e.id === id)!, 400);
    }
    return api.put<Education>(`/education/${id}`, item, { auth: true });
  },

  async deleteEducation(id: number): Promise<void> {
    if (USE_MOCKS) {
      localEducation = localEducation.filter((e) => e.id !== id);
      return mockDelay(undefined, 300);
    }
    return api.delete<void>(`/education/${id}`, { auth: true });
  },
};
