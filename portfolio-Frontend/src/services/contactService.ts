import { api, USE_MOCKS, mockDelay } from "./api";
import type { ContactFormValues } from "../types";

export const contactService = {
  async sendMessage(values: ContactFormValues): Promise<{ success: boolean }> {
    if (USE_MOCKS) return mockDelay({ success: true }, 900);
    return api.post<{ success: boolean }>("/contact", values);
  },
};
