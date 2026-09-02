import { API_BASE_URL, USE_MOCKS } from "./api";

export interface BackendHealthStatus {
  isUp: boolean;
  status?: string;
  message?: string;
  timestamp?: number;
  latencyMs?: number;
}

export function getHealthUrl(): string {
  const cleanBase = (API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (cleanBase.endsWith("/api")) {
    return `${cleanBase}/health`;
  }
  return cleanBase ? `${cleanBase}/api/health` : "/api/health";
}

export async function pingBackend(timeoutMs = 6000): Promise<BackendHealthStatus> {
  if (USE_MOCKS) {
    return {
      isUp: true,
      status: "UP",
      timestamp: Date.now(),
      latencyMs: 0,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = performance.now();

  try {
    const url = getHealthUrl();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timer);
    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      try {
        const body = await response.json();
        return {
          isUp: true,
          status: body?.status || "UP",
          message: body?.message,
          timestamp: body?.timestamp || Date.now(),
          latencyMs,
        };
      } catch {
        return {
          isUp: true,
          status: "UP",
          latencyMs,
        };
      }
    }

    return {
      isUp: false,
      status: "DOWN",
      latencyMs,
    };
  } catch {
    clearTimeout(timer);
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      isUp: false,
      status: "DOWN",
      latencyMs,
    };
  }
}
