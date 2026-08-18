import { api, USE_MOCKS, mockDelay, ApiError } from "./api";
import type { AdminUser } from "../types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Mock admin used only for local frontend development.
// Real authentication (hashing, sessions, JWT signing) happens in Spring Security.
const MOCK_ADMIN = {
  email: "admin@mohiuddin.dev",
  password: "admin123",
  user: { id: 1, name: "Mohi Ud Din", email: "admin@mohiuddin.dev", role: "admin" as const },
};

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const authService = {
  async login({ email, password, rememberMe }: LoginPayload): Promise<AdminUser> {
    if (USE_MOCKS) {
      if (email !== MOCK_ADMIN.email || password !== MOCK_ADMIN.password) {
        throw new ApiError("Invalid email or password.", 401);
      }
      const token = "mock-jwt-token";
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      storage.setItem(USER_KEY, JSON.stringify(MOCK_ADMIN.user));
      return mockDelay(MOCK_ADMIN.user, 600);
    }

    const res = await api.post<{ token: string; user: AdminUser }>("/auth/login", { email, password });
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, res.token);
    storage.setItem(USER_KEY, JSON.stringify(res.user));
    return res.user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    if (!USE_MOCKS) {
      try {
        await api.post("/auth/logout", undefined, { auth: true });
      } catch {
        /* best-effort logout */
      }
    }
  },

  getCurrentUser(): AdminUser | null {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCKS) {
      if (oldPassword !== MOCK_ADMIN.password) {
        throw new ApiError("Current password does not match.", 400);
      }
      MOCK_ADMIN.password = newPassword;
      return mockDelay(undefined, 500);
    }
    return api.put<void>("/users/password", { oldPassword, newPassword }, { auth: true });
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
