"use client";

import React from "react";
import clsx from "clsx";
import UserCardBorder from "@/components/shared/UserCardBorder";

interface UserCardSkeletonProps {
  className?: string;
}

const UserCardSkeleton: React.FC<UserCardSkeletonProps> = ({ className }) => {
  return (
    <div className={clsx("space-y-3", className)}>
      {[...Array(2)].map((_, i) => (
        <UserCardBorder key={i}>
          <div className="flex items-center gap-4">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-zinc-700 animate-pulse" />

            {/* Name + role placeholders */}
            <div>
              <div className="w-32 h-5 bg-zinc-700 animate-pulse rounded mb-2" />
              <div className="w-20 h-4 bg-zinc-700 animate-pulse rounded" />
            </div>
          </div>

          {/* Chevron placeholder */}
          <div className="w-5 h-5 rounded-full bg-zinc-700 animate-pulse" />
        </UserCardBorder>
      ))}
    </div>
  );
};

export default UserCardSkeleton;
