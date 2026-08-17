import { api, USE_MOCKS, mockDelay } from "./api";
import { mockSkills } from "../data/mock/skills";
import type { Skill } from "../types";

let localSkills = [...mockSkills];

export const skillService = {
  async getSkills(): Promise<Skill[]> {
    if (USE_MOCKS) return mockDelay([...localSkills], 450);
    return api.get<Skill[]>("/skills");
  },

  async createSkill(skill: Omit<Skill, "id">): Promise<Skill> {
    if (USE_MOCKS) {
      const created = { ...skill, id: Date.now() };
      localSkills = [...localSkills, created];
      return mockDelay(created, 400);
    }
    return api.post<Skill>("/skills", skill, { auth: true });
  },

  async updateSkill(id: number, skill: Partial<Skill>): Promise<Skill> {
    if (USE_MOCKS) {
      localSkills = localSkills.map((s) => (s.id === id ? { ...s, ...skill } : s));
      return mockDelay(localSkills.find((s) => s.id === id)!, 400);
    }
    return api.put<Skill>(`/skills/${id}`, skill, { auth: true });
  },

  async deleteSkill(id: number): Promise<void> {
    if (USE_MOCKS) {
      localSkills = localSkills.filter((s) => s.id !== id);
      return mockDelay(undefined, 300);
    }
    return api.delete<void>(`/skills/${id}`, { auth: true });
  },
};
