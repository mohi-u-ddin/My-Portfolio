import { api, USE_MOCKS, mockDelay } from "./api";
import { mockProfile } from "../data/mock/profile";

let localResumeUrl = mockProfile.resumeUrl;

export const resumeService = {
  async getResumeUrl(): Promise<string> {
    if (USE_MOCKS) return mockDelay(localResumeUrl, 300);
    const res = await api.get<{ url: string }>("/resume");
    return res.url || "";
  },

  async uploadResume(file: File): Promise<{ url: string }> {
    if (USE_MOCKS) {
      localResumeUrl = `/resume/${file.name}`;
      return mockDelay({ url: localResumeUrl }, 500);
    }
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ url: string }>("/resume", formData, { auth: true });
  },

  async deleteResume(): Promise<void> {
    if (USE_MOCKS) {
      localResumeUrl = "";
      return mockDelay(undefined, 300);
    }
    return api.delete<void>("/resume", { auth: true });
  },
};
