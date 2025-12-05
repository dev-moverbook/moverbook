"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  pickPrimaryCta,
  RouteError,
  toUiError,
} from "@/frontendUtils/errorHelper";

export default function Error({
  error,
  reset,
}: {
  error: RouteError;
  reset: () => void;
}) {
  const { code, message } = toUiError(error);
  const cta = pickPrimaryCta(code);

  return (
    <div className="m-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm">
      <div className="font-medium">Error</div>
      <p className="mt-1 opacity-80">{message}</p>

      <div className="mt-3 flex">
        {cta.kind === "retry" ? (
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        ) : (
          <Link href={cta.href} className="rounded-md underline text-sm">
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
