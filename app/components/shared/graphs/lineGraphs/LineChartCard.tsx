"use client";

import ChartCard from "../ChartCard";
import LineGraphCore from "./LineGraphCore";
import type { LineGraphDatum } from "@/types/types";

type LineChartCardProps = {
  title: React.ReactNode;
  data: LineGraphDatum[];
  bodyHeight?: number | string;
  className?: string;
  color?: string;
  emptyMessage?: string;
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
  labelFormatter?: (label: string | number) => string;
  showDots?: boolean;
  valueFormatter?: (value: number) => string;
};

export default function LineChartCard({
  title,
  data,
  bodyHeight = 220,
  className,
  color = "#3B82F6",
  emptyMessage = "No data",
  footer,
  headerRight,
  labelFormatter,
  showDots = false,
  valueFormatter,
}: LineChartCardProps) {
  const safeData = Array.isArray(data) ? data : [];
  const isEmpty = safeData.length === 0;

  return (
    <ChartCard
      title={title}
      className={className}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
      bodyHeight={bodyHeight}
      headerRight={headerRight}
      footer={footer}
    >
      {!isEmpty && (
        <LineGraphCore
          data={safeData}
          color={color}
          showDots={showDots}
          labelFormatter={labelFormatter}
          valueFormatter={valueFormatter}
        />
      )}
    </ChartCard>
  );
}
