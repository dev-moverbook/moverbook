// app/app/[slug]/add-move/hooks/useRunOnceWhen.ts
"use client";
import { useEffect, useRef } from "react";

export function useRunOnceWhen(cond: boolean, fn: () => void) {
  const didRun = useRef(false);
  useEffect(() => {
    if (!didRun.current && cond) {
      didRun.current = true;
      fn();
    }
  }, [cond, fn]);
}
