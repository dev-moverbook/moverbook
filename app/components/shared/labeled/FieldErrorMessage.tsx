"use client";

import React from "react";
import clsx from "clsx";

interface FieldErrorMessageProps {
  error?: string | null;
}

const FieldErrorMessage: React.FC<FieldErrorMessageProps> = ({ error }) => {
  return (
    <p
      className={clsx(
        "text-sm h-5 transition-opacity duration-200",
        error ? "text-red-500 opacity-100" : "opacity-0"
      )}
    >
      {error || " "}
    </p>
  );
};

export default FieldErrorMessage;
