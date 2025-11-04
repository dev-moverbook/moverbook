"use client";

import { SegmentDistance } from "@/types/types";
import ListRowContainer from "../shared/containers/ListRowContainer";
import ListRow from "../shared/ui/ListRow";
import {
  sumSegments,
  formatMiles,
  formatDurationFromMinutes,
} from "@/frontendUtils/helper";

interface LocationCardProps {
  segmentDistances: SegmentDistance[];
}

const LocationCard = ({ segmentDistances }: LocationCardProps) => {
  const { totalMiles, totalMinutes } = sumSegments(
    segmentDistances.map((s) => ({
      distance: s.distance ?? null,
      duration: s.duration ?? null,
    }))
  );

  const total = `${formatMiles(totalMiles)} (${formatDurationFromMinutes(totalMinutes)})`;

  const rows = [
    ...segmentDistances.map((seg) => ({
      label: seg.label,
      value: formatDurationFromMinutes(seg.duration ?? null),
      bold: false,
    })),
    {
      label: "Total",
      value: total,
      bold: true,
    },
  ];

  return (
    <ListRowContainer className="border-t border-grayCustom ">
      {rows.map((row, i) => (
        <ListRow
          key={i}
          left={row.label}
          right={row.value}
          className={`${i % 2 === 0 ? "bg-background2" : ""} ${row.bold ? "font-bold" : ""}`}
        />
      ))}
    </ListRowContainer>
  );
};

export default LocationCard;
