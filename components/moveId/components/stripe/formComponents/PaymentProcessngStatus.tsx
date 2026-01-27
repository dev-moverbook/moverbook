"use client";

import { Loader2, Lock } from "lucide-react";

export function PaymentProcessingStatus() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-green-500" />
        <Lock className="h-4 w-4 absolute inset-0 m-auto text-white" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold">Processing Transaction</p>
        <p className="text-gray-400 text-sm">
          Please do not refresh or close this window.
        </p>
      </div>
    </div>
  );
}
