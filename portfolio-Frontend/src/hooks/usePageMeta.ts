import { useEffect } from "react";

// Lightweight SEO helper: sets document title + meta description without
// pulling in a dedicated head-management library.
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let descTag: HTMLMetaElement | null = null;
    if (description) {
      descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}
