import { api, USE_MOCKS, mockDelay } from "./api";
import { mockProfile } from "../data/mock/profile";

export interface ResumeDetails {
  url: string;
  fileName?: string;
  fileSize?: number;
  updatedAt?: string;
}

let localResumeUrl = mockProfile.resumeUrl;

export const resumeService = {
  async getResumeDetails(): Promise<ResumeDetails> {
    if (USE_MOCKS) {
      return mockDelay(
        {
          url: localResumeUrl,
          fileName: localResumeUrl ? localResumeUrl.split("/").pop() : "",
          fileSize: 0,
          updatedAt: "",
        },
        300
      );
    }
    const res = await api.get<ResumeDetails>("/resume");
    return res || { url: "", fileName: "" };
  },

  async getResumeUrl(): Promise<string> {
    const details = await this.getResumeDetails();
    return details.url || "";
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

