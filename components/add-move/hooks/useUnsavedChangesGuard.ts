"use client";
import { useEffect } from "react";

export function useUnsavedChangesGuard(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [enabled]);
}
