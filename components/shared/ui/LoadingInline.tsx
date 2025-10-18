"use client";
import React from "react";

const LoadingInline: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default LoadingInline;
