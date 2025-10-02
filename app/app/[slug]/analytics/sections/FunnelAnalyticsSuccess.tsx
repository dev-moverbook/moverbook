"use client";

import FunnelChartCard from "@/app/components/shared/graphs/funnel/FunnelChartCard";
import type { FunnelPoint } from "@/types/types";

type FunnelAnalyticsSuccessProps = {
  series: FunnelPoint[];
};

export default function FunnelAnalyticsSuccess({
  series,
}: FunnelAnalyticsSuccessProps) {
  return (
    <div className="flex flex-col gap-4">
      <FunnelChartCard title="Funnel" series={series} />
    </div>
  );
}
