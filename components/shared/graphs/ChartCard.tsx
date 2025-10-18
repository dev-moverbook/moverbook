type ChartCardProps = {
  title: React.ReactNode;
  className?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  bodyHeight?: number | string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export default function ChartCard({
  title,
  className,
  isEmpty = false,
  emptyMessage = "No data",
  bodyHeight = 220,
  headerRight,
  footer,
  children,
}: ChartCardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-neutral-900/40 p-4 text-white " +
        (className ?? "")
      }
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-semibold opacity-90">{title}</div>
        {headerRight ? <div className="ml-4">{headerRight}</div> : null}
      </div>
      {isEmpty ? (
        <div className="flex h-[240px] items-center justify-center text-sm text-white/70">
          {emptyMessage}
        </div>
      ) : (
        <div style={{ height: bodyHeight }}>{children}</div>
      )}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
