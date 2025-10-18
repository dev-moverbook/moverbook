"use client";
import { useEffect, useRef } from "react";

export function useRunOnceWhen(cond: boolean, fn: () => void) {
  const didRun = useRef<boolean>(false);
  useEffect(() => {
    if (!didRun.current && cond) {
      didRun.current = true;
      fn();
    }
  }, [cond, fn]);
}
