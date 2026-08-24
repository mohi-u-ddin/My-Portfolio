import { API_BASE_URL } from "../services/api";

export function resolveMediaUrl(url: string | null | undefined, fallback = ""): string {
  if (!url || url.trim() === "" || url === "#") {
    return fallback;
  }

  const cleanUrl = url.trim();

  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith("/api/")) {
    const origin = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${origin}${cleanUrl}`;
  }

  return cleanUrl;
}
