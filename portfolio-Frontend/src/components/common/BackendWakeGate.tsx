import type { ReactNode } from "react";
import { useBackend } from "../../contexts/BackendContext";
import { BackendLoadingWindow } from "./BackendLoadingWindow";

export function BackendWakeGate({ children }: { children: ReactNode }) {
  const { isAwake } = useBackend();

  return (
    <>
      <BackendLoadingWindow />
      {isAwake ? children : null}
    </>
  );
}
