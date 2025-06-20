"use client";

import React, { FormEvent } from "react";
import FormErrorMessage from "../error/FormErrorMessage";
import { Button } from "../../ui/button";

interface TripleFormActionProps {
  onPrimary: (e: FormEvent) => void | Promise<void>;
  onSecondary: () => void | Promise<void>;
  onTertiary: () => void | Promise<void>;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryLabel?: string;
  isLoading?: boolean; // global fallback
  primaryLoading?: boolean;
  secondaryLoading?: boolean;
  tertiaryLoading?: boolean;
  disabled?: boolean;
  error?: string | null;
  primaryVariant?: "default" | "destructive" | "outline" | "ghost";
  secondaryVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "whiteGhost";
  tertiaryVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "whiteGhost";
}

const TripleFormAction: React.FC<TripleFormActionProps> = ({
  onPrimary,
  onSecondary,
  onTertiary,
  primaryLabel = "Submit",
  secondaryLabel = "Back",
  tertiaryLabel = "Reset",
  isLoading = false,
  primaryLoading,
  secondaryLoading,
  tertiaryLoading,
  disabled = false,
  error,
  primaryVariant = "default",
  secondaryVariant = "ghost",
  tertiaryVariant = "outline",
}) => {
  return (
    <div className="max-w-screen-sm mx-auto md:px-0 px-4 mt-4">
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-3 gap-4">
        <Button
          onClick={onSecondary}
          variant={secondaryVariant}
          className="w-full"
          disabled={secondaryLoading || disabled}
          isLoading={secondaryLoading}
        >
          {secondaryLabel}
        </Button>

        <Button
          onClick={onTertiary}
          variant={tertiaryVariant}
          className="w-full"
          disabled={tertiaryLoading || disabled}
          isLoading={tertiaryLoading}
        >
          {tertiaryLabel}
        </Button>

        <Button
          onClick={onPrimary}
          variant={primaryVariant}
          className="w-full"
          disabled={primaryLoading || isLoading || disabled}
          isLoading={primaryLoading || isLoading}
        >
          {primaryLabel}
        </Button>
      </div>
      <FormErrorMessage className="text-center" message={error} />
    </div>
  );
};

export default TripleFormAction;
