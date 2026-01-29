"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSkeleton() {
  return (
    <div className="space-y-6 p-1">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" /> 
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>
  
      <Skeleton className="h-12 w-full rounded-md mt-8" />
    </div>
  );
}