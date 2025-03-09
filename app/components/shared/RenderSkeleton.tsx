import { Skeleton } from "@/components/ui/skeleton";

const RenderSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-6 w-40" />
    </div>
  );
};

export default RenderSkeleton;
