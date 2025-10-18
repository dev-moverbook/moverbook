"use client";

type ChartCardSkeletonProps = {
  heightClass?: string;
};

export default function ChartCardSkeleton({
  heightClass = "h-[240px]",
}: ChartCardSkeletonProps): React.ReactNode {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4 text-white"
      role="status"
      aria-busy
      aria-label="Loading chart"
    >
      <div className="mb-3 h-5 w-40 animate-pulse rounded bg-white/10" />
      <div
        className={`w-full animate-pulse rounded-xl bg-white/5 ${heightClass}`}
      />
    </div>
  );
}
