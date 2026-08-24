import { useState, useEffect, type ReactNode } from "react";
import { Button } from "./Button";
import "./StatusView.css";

interface StatusViewProps {
  loadingLabel: string;
  emptyLabel: string;
  errorLabel: string;
  retryLabel: string;
  onRetry?: () => void;
  icon?: ReactNode;
  variant: "loading" | "empty" | "error";
}

export function StatusView({ loadingLabel, emptyLabel, errorLabel, retryLabel, onRetry, icon, variant }: StatusViewProps) {
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    if (variant !== "loading") {
      setIsWakingUp(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsWakingUp(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [variant]);

  if (variant === "loading") {
    return (
      <div className="status-view status-view--loading" role="status" aria-live="polite">
        <span className="status-view__spinner" aria-hidden="true" />
        <p>{loadingLabel}</p>
        {isWakingUp && (
          <span className="status-view__waking-note">
            Connecting to server... (Waking up from idle state, please wait a moment)
          </span>
        )}
      </div>
    );
  }

  if (variant === "empty") {
    return (
      <div className="status-view status-view--empty">
        {icon}
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="status-view status-view--error" role="alert">
      <p>{errorLabel}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
