import { useEffect, useState } from "react";
import { Monitor, Server } from "lucide-react";
import { useBackend } from "../../contexts/BackendContext";
import "./BackendLoadingWindow.css";

export function BackendLoadingWindow() {
  const { isWaking, isReadyTransition } = useBackend();
  const [connectState, setConnectState] = useState<"idle" | "connecting" | "connected">("idle");

  useEffect(() => {
    if (!isWaking) {
      setConnectState("idle");
      return;
    }

    if (isReadyTransition) {
      setConnectState("connecting");

      const connectedTimer = setTimeout(() => {
        setConnectState("connected");
      }, 1400);

      return () => {
        clearTimeout(connectedTimer);
      };
    } else {
      setConnectState("idle");
    }
  }, [isWaking, isReadyTransition]);

  if (!isWaking) return null;

  const isConnectingOrConnected = connectState === "connecting" || connectState === "connected";
  const isConnected = connectState === "connected";

  return (
    <div
      className={`backend-wake-overlay ${isReadyTransition ? "backend-wake-overlay--leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Connecting Frontend and Backend"
    >
      <div className="backend-wake-stage">
        <div className="wake-node wake-node--frontend">
          <div className="wake-node-icon-wrap wake-node-icon-wrap--frontend">
            <Monitor className="wake-icon wake-icon--frontend" size={32} strokeWidth={1.8} />
            <span className="wake-node-status-dot wake-node-status-dot--online" />
          </div>
          <span className="wake-node-label">Frontend</span>
        </div>

        <div className="wake-line-track">
          <div className="wake-line-base" />

          {!isConnectingOrConnected && (
            <>
              <span className="wake-ping-pulse wake-ping-pulse-1" />
              <span className="wake-ping-pulse wake-ping-pulse-2" />
            </>
          )}

          <div
            className={`wake-line-beam ${isConnectingOrConnected ? "wake-line-beam--active" : ""} ${isConnected ? "wake-line-beam--connected" : ""}`}
          >
            <span className="wake-line-spark" />
          </div>
        </div>

        <div
          className={`wake-node wake-node--backend ${isConnected ? "wake-node--connected" : "wake-node--waking"}`}
        >
          <div className="wake-node-icon-wrap wake-node-icon-wrap--backend">
            <Server className="wake-icon wake-icon--backend" size={32} strokeWidth={1.8} />
            <span
              className={`wake-node-status-dot ${isConnected ? "wake-node-status-dot--connected" : "wake-node-status-dot--waking"}`}
            />
            {isConnected && <span className="wake-node-shockwave" />}
          </div>
          <span className="wake-node-label">Backend</span>
        </div>
      </div>
    </div>
  );
}

