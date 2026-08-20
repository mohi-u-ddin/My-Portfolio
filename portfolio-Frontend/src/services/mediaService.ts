import { api, USE_MOCKS, mockDelay } from "./api";

export const mediaService = {
  async uploadImage(file: File, category = "PROJECT_IMAGE"): Promise<{ url: string; id?: number }> {
    if (USE_MOCKS) {
      // Create a local Object URL for immediate preview
      const previewUrl = URL.createObjectURL(file);
      return mockDelay({ url: previewUrl, id: Date.now() }, 400);
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    return api.post<{ url: string; id?: number }>("/upload", formData, { auth: true });
  },

  async uploadAvatar(file: File): Promise<{ url: string; id?: number }> {
    if (USE_MOCKS) {
      const previewUrl = URL.createObjectURL(file);
      return mockDelay({ url: previewUrl, id: Date.now() }, 400);
    }
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ url: string; id?: number }>("/media/avatar", formData, { auth: true });
  },
};
