"use client";

import { cn } from "@/lib/utils";
import SectionContainer from "../section/SectionContainer";
import CenteredContainer from "../containers/CenteredContainer";

const FormSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <SectionContainer isLast>
      <CenteredContainer>
        <div className={cn("p-4 mt-4  bg-black  border-zinc-800", className)}>
          <div className="flex justify-between items-center pb-4">
            <div className="h-6 w-40 bg-zinc-700 animate-pulse rounded" />
            <div className="h-8 w-20 bg-zinc-700 animate-pulse rounded-lg" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
              <div className="h-10 w-full bg-zinc-700 animate-pulse rounded" />
            </div>
            <div>
              <div className="h-4 w-40 bg-zinc-800 rounded mb-2" />
              <div className="h-10 w-full bg-zinc-700 animate-pulse rounded" />
            </div>
            <div>
              <div className="h-4 w-48 bg-zinc-800 rounded mb-2" />
              <div className="h-10 w-full bg-zinc-700 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default FormSkeleton;
