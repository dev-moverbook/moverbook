"use client";

import React from "react";
import clsx from "clsx";

interface FieldErrorMessageProps {
  error?: string | null;
  noPlaceholder?: boolean;
}

const FieldErrorMessage: React.FC<FieldErrorMessageProps> = ({
  error,
  noPlaceholder = false,
}) => {
  if (noPlaceholder && !error) {
    return null;
  }

  return (
    <p
      className={clsx(
        "text-xs transition-opacity duration-200 pl-1.5",
        error ? "text-red-500 opacity-100" : "opacity-0",
        !noPlaceholder && "h-5"
      )}
    >
      {error || (!noPlaceholder && " ")}
    </p>
  );
};

export default FieldErrorMessage;
