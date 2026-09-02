import { useBackend } from "../../contexts/BackendContext";
import { useLanguage } from "../../contexts/LanguageContext";
import "./BackendLoadingWindow.css";

export function BackendLoadingWindow() {
  const { isWaking, isReadyTransition, retryWake, elapsedSeconds } = useBackend();
  const { t } = useLanguage();

  if (!isWaking) return null;

  return (
    <div
      className={`backend-loading-overlay ${isReadyTransition ? "backend-loading-overlay--done" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.backendWake.loading}
    >
      <div className="backend-loading-card">
        <div className="backend-loading-spinner-wrap">
          <div className="backend-loading-spinner" />
          <div className="backend-loading-spinner-inner" />
        </div>

        <h2 className="backend-loading-title">{t.backendWake.loading}</h2>
        <p className="backend-loading-desc">{t.backendWake.pleaseWait}</p>

        {elapsedSeconds > 25 && (
          <button
            type="button"
            className="backend-loading-retry-btn"
            onClick={retryWake}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
