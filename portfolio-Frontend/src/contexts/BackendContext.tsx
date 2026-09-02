import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { pingBackend } from "../services/healthService";
import { USE_MOCKS, setUseMocks } from "../services/api";

const SESSION_AWAKE_KEY = "portfolio_backend_awake_ts";
const SESSION_TTL_MS = 15 * 60 * 1000;

export interface BackendContextValue {
  isAwake: boolean;
  isWaking: boolean;
  isReadyTransition: boolean;
  elapsedSeconds: number;
  retryWake: () => void;
  skipToDemo: () => void;
}

const BackendContext = createContext<BackendContextValue | undefined>(undefined);

function isRecentlyAwake(): boolean {
  if (typeof window === "undefined") return false;
  const stored = sessionStorage.getItem(SESSION_AWAKE_KEY);
  if (!stored) return false;
  const timestamp = parseInt(stored, 10);
  if (Number.isNaN(timestamp)) return false;
  return Date.now() - timestamp < SESSION_TTL_MS;
}

export function BackendProvider({ children }: { children: ReactNode }) {
  const [isAwake, setIsAwake] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("preview_wake") === "true") return false;
    if (USE_MOCKS) return true;
    return isRecentlyAwake();
  });

  const [isWaking, setIsWaking] = useState<boolean>(false);
  const [isReadyTransition, setIsReadyTransition] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const activePollingRef = useRef<boolean>(false);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = useCallback(() => {
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
  }, []);

  const handleAwakeSuccess = useCallback(() => {
    activePollingRef.current = false;
    stopTimers();
    setIsReadyTransition(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_AWAKE_KEY, Date.now().toString());
    }

    setTimeout(() => {
      setIsAwake(true);
    }, 400);

    setTimeout(() => {
      setIsWaking(false);
      setIsReadyTransition(false);
    }, 800);
  }, [stopTimers]);

  const skipToDemo = useCallback(() => {
    setUseMocks(true);
    handleAwakeSuccess();
  }, [handleAwakeSuccess]);

  const startWakeLoop = useCallback(async () => {
    if (activePollingRef.current) return;
    activePollingRef.current = true;

    setElapsedSeconds(0);
    setIsReadyTransition(false);
    stopTimers();

    const startTime = Date.now();
    intervalTimerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const firstResult = await pingBackend(5000);
    if (!activePollingRef.current) return;

    if (firstResult.isUp) {
      handleAwakeSuccess();
      return;
    }

    setIsWaking(true);

    while (activePollingRef.current) {
      await new Promise((r) => setTimeout(r, 2500));
      if (!activePollingRef.current) break;

      const result = await pingBackend(5000);
      if (!activePollingRef.current) break;

      if (result.isUp) {
        handleAwakeSuccess();
        break;
      }
    }
  }, [handleAwakeSuccess, stopTimers]);

  const retryWake = useCallback(() => {
    activePollingRef.current = false;
    stopTimers();
    startWakeLoop();
  }, [startWakeLoop, stopTimers]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const forceWakePreview = urlParams.get("preview_wake") === "true";

    if (forceWakePreview) {
      setIsAwake(false);
      setIsWaking(true);
      startWakeLoop();
      return;
    }

    if (USE_MOCKS) {
      setIsAwake(true);
      setIsWaking(false);
      return;
    }

    if (isRecentlyAwake()) {
      setIsAwake(true);
      setIsWaking(false);
      pingBackend(4000).then((res) => {
        if (res.isUp) {
          sessionStorage.setItem(SESSION_AWAKE_KEY, Date.now().toString());
        }
      });
      return;
    }

    let initialTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      setIsWaking(true);
    }, 300);

    startWakeLoop().finally(() => {
      if (initialTimer) {
        clearTimeout(initialTimer);
        initialTimer = null;
      }
    });

    return () => {
      activePollingRef.current = false;
      stopTimers();
      if (initialTimer) clearTimeout(initialTimer);
    };
  }, [startWakeLoop, stopTimers]);

  return (
    <BackendContext.Provider
      value={{
        isAwake,
        isWaking,
        isReadyTransition,
        elapsedSeconds,
        retryWake,
        skipToDemo,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend(): BackendContextValue {
  const ctx = useContext(BackendContext);
  if (!ctx) throw new Error("useBackend must be used within a BackendProvider");
  return ctx;
}
