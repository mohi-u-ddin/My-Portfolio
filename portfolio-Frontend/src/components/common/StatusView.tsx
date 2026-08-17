import type { ReactNode } from "react";
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

// Consistent Loading / Empty / Error presentation used across every
// API-driven section (Projects, Experience, Education, ...).
export function StatusView({ loadingLabel, emptyLabel, errorLabel, retryLabel, onRetry, icon, variant }: StatusViewProps) {
  if (variant === "loading") {
    return (
      <div className="status-view status-view--loading" role="status" aria-live="polite">
        <span className="status-view__spinner" aria-hidden="true" />
        <p>{loadingLabel}</p>
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
