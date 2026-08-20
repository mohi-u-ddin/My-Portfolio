import { API_BASE_URL } from "../services/api";

/**
 * Resolves media/resume/avatar/project image URLs.
 * If the URL is a backend API route (e.g. /api/resume/download or /api/media/1),
 * it converts it into a full URL targeting the Spring Boot backend server.
 */
export function resolveMediaUrl(url: string | null | undefined, fallback = ""): string {
  if (!url || url.trim() === "" || url === "#") {
    return fallback;
  }

  const cleanUrl = url.trim();

  // If already absolute or data/blob URL
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }

  // If it's an API route (/api/...)
  if (cleanUrl.startsWith("/api/")) {
    const origin = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${origin}${cleanUrl}`;
  }

  return cleanUrl;
}
