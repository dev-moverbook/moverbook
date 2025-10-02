"use client";

import { isFunnelEmpty } from "@/app/frontendUtils/graphHelpers";
import ChartCard from "../ChartCard";
import FunnelGraphCore from "./FunnelGraphCore";
import type { FunnelPoint } from "@/types/types";

type FunnelChartCardProps = {
  bodyHeight?: number | string;
  className?: string;
  emptyMessage?: string;
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
  labelFormatter?: (label: string | number) => string;
  series: FunnelPoint[];
  title: React.ReactNode;
  valueFormatter?: (value: number) => string;
};

export default function FunnelChartCard({
  bodyHeight = 240,
  className,
  emptyMessage = "No data",
  footer,
  headerRight,
  labelFormatter,
  series,
  title,
  valueFormatter,
}: FunnelChartCardProps) {
  const isEmpty = isFunnelEmpty(series);

  return (
    <ChartCard
      bodyHeight={bodyHeight}
      className={className}
      emptyMessage={emptyMessage}
      footer={footer}
      headerRight={headerRight}
      isEmpty={isEmpty}
      title={title}
    >
      {!isEmpty && (
        <FunnelGraphCore
          labelFormatter={labelFormatter}
          series={series}
          valueFormatter={valueFormatter}
        />
      )}
    </ChartCard>
  );
}
