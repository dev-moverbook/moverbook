// components/shared/DataLoader.tsx
"use client";

import React from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import RenderSkeleton from "../RenderSkeleton";
import ErrorComponent from "../ErrorComponent";

interface DataLoaderProps<T> {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  data: T;
  children: (data: T) => React.ReactNode;
}

const DataLoader = <T,>({
  isLoading,
  isError,
  errorMessage,
  data,
  children,
}: DataLoaderProps<T>) => {
  if (isLoading) return <RenderSkeleton />;
  if (isError)
    return (
      <ErrorComponent message={errorMessage ?? FrontEndErrorMessages.GENERIC} />
    );
  return <>{children(data)}</>;
};

export default DataLoader;
