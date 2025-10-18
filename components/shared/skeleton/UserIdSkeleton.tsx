"use client";

import React from "react";
import clsx from "clsx";

type Props = { className?: string };

const UserIdContentSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx("w-full", className)}>
      {/* Header: back / centered title / actions */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-2">
        {/* Left: back icon */}
        <div className="justify-self-start">
          <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
        </div>

        {/* Center: title */}
        <div className="justify-self-center">
          <div className="h-6 w-32 bg-zinc-700 animate-pulse rounded" />
        </div>

        {/* Right: actions (edit/delete) */}
        <div className="justify-self-end flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
        </div>
      </div>

      {/* Avatar */}
      <div className="w-full flex justify-center my-4">
        <div className="w-24 h-24 rounded-full bg-zinc-700 animate-pulse" />
      </div>

      {/* Fields group */}
      <div className="space-y-6 mt-2">
        {/* Name */}
        <div>
          <div className="h-4 w-16 bg-zinc-800 rounded mb-2" />
          <div className="h-5 w-48 bg-zinc-700 animate-pulse rounded" />
        </div>

        {/* Email */}
        <div>
          <div className="h-4 w-16 bg-zinc-800 rounded mb-2" />
          <div className="h-5 w-64 bg-zinc-700 animate-pulse rounded" />
        </div>

        {/* Role */}
        <div>
          <div className="h-4 w-12 bg-zinc-800 rounded mb-2" />
          <div className="h-5 w-24 bg-zinc-700 animate-pulse rounded" />
        </div>

        {/* Status */}
        <div>
          <div className="h-4 w-14 bg-zinc-800 rounded mb-2" />
          <div className="h-5 w-20 bg-zinc-700 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};

export default UserIdContentSkeleton;
