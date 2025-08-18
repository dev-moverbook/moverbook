import React from "react";
import { formatDecimalNumber } from "@/app/frontendUtils/helper";
import { SegmentDistance } from "@/types/types";
import ListRowContainer from "../shared/containers/ListRowContainer";
import ListRow from "../shared/ui/ListRow";

interface LocationCardProps {
  segmentDistances: SegmentDistance[];
  roundTripMiles: number | null;
  roundTripDrive: number | null;
}

const LocationCard = ({
  segmentDistances,
  roundTripMiles,
  roundTripDrive,
}: LocationCardProps) => {
  const rows = [
    ...segmentDistances.map((seg) => ({
      label: seg.label,
      value: formatDecimalNumber(seg.distance, "miles"),
      bold: false,
    })),
    {
      label: "Total Miles",
      value: formatDecimalNumber(roundTripMiles, "miles"),
      bold: true,
    },
    {
      label: "Total Drive Time",
      value: formatDecimalNumber(roundTripDrive, "hours"),
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
