import { api, USE_MOCKS, mockDelay } from "./api";
import { mockContactMessages } from "../data/mock/contactMessages";
import type { ContactFormValues, ContactMessage } from "../types";

let localMessages = [...mockContactMessages];

export const contactService = {
  async sendMessage(values: ContactFormValues): Promise<{ success: boolean }> {
    if (USE_MOCKS) {
      const newMessage: ContactMessage = {
        id: Date.now(),
        ...values,
        read: false,
        createdAt: new Date().toISOString(),
      };
      localMessages = [newMessage, ...localMessages];
      return mockDelay({ success: true }, 600);
    }
    await api.post<ContactMessage>("/contact", values);
    return { success: true };
  },

  async getMessages(): Promise<ContactMessage[]> {
    if (USE_MOCKS) return mockDelay([...localMessages], 400);
    return api.get<ContactMessage[]>("/contact/messages", { auth: true });
  },

  async getUnreadCount(): Promise<number> {
    if (USE_MOCKS) {
      const count = localMessages.filter((m) => !m.read).length;
      return mockDelay(count, 200);
    }
    return api.get<number>("/contact/messages/unread-count", { auth: true });
  },

  async markAsRead(id: number, read: boolean = true): Promise<ContactMessage> {
    if (USE_MOCKS) {
      localMessages = localMessages.map((m) => (m.id === id ? { ...m, read } : m));
      const found = localMessages.find((m) => m.id === id);
      if (!found) throw new Error("Message not found");
      return mockDelay({ ...found }, 200);
    }
    return api.patch<ContactMessage>(`/contact/messages/${id}/read?read=${read}`, undefined, { auth: true });
  },

  async deleteMessage(id: number): Promise<void> {
    if (USE_MOCKS) {
      localMessages = localMessages.filter((m) => m.id !== id);
      return mockDelay(undefined, 300);
    }
    return api.delete<void>(`/contact/messages/${id}`, { auth: true });
  },
};

