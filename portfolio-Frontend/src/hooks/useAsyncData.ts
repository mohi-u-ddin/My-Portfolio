import { useCallback, useEffect, useState } from "react";
import type { RequestState } from "../types";

interface UseAsyncDataResult<T> {
  data: T | null;
  state: RequestState;
  errorMessage: string | null;
  reload: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: { isEmpty?: (data: T) => boolean; deps?: unknown[] } = {}
): UseAsyncDataResult<T> {
  const { isEmpty, deps = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<RequestState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setState("loading");
    setErrorMessage(null);

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        const empty = isEmpty ? isEmpty(result) : Array.isArray(result) && result.length === 0;
        setState(empty ? "empty" : "success");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, ...deps]);

  useEffect(() => load(), [load]);

  const reload = () => setReloadKey((k) => k + 1);

  return { data, state, errorMessage, reload };
}
