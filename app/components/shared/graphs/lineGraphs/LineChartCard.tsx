"use client";

import ChartCard from "../ChartCard";
import LineGraphCore from "./LineGraphCore";
import type { LineSeries } from "@/types/types";
import { isSeriesEmpty, seriesHasSignal } from "./lineGraphUtils";

type LineChartCardProps = {
  bodyHeight?: number | string;
  className?: string;
  emptyMessage?: string;
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
  labelFormatter?: (label: string | number) => string;
  series: LineSeries[];
  showDots?: boolean;
  title: React.ReactNode;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
};

export default function LineChartCard({
  bodyHeight = 220,
  className,
  emptyMessage = "No data",
  footer,
  headerRight,
  labelFormatter,
  series,
  showDots = false,
  title,
  valueFormatter,
  tooltipValueFormatter,
}: LineChartCardProps) {
  const isEmpty = isSeriesEmpty(series) || !seriesHasSignal(series, 0);

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
        <LineGraphCore
          labelFormatter={labelFormatter}
          series={series}
          showDotsDefault={showDots}
          valueFormatter={valueFormatter}
          tooltipValueFormatter={tooltipValueFormatter}
        />
      )}
    </ChartCard>
  );
}
