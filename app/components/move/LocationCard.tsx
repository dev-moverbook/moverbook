import React from "react";
import CustomCard from "../shared/CustomCard";
import CardDetailRow from "../shared/CardDetailRow";
import CardDetailsWrapper from "../shared/CardDetailsWrapper";
import { formatDecimalNumber } from "@/app/frontendUtils/helper";
import { SegmentDistance } from "@/types/types";

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
    <CustomCard className="p-0">
      <CardDetailsWrapper className="mt-0">
        {rows.map((row, i) => {
          return (
            <CardDetailRow
              key={i}
              label={row.label}
              value={row.value}
              className={` ${row.bold ? "font-bold" : ""}`}
            />
          );
        })}
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default LocationCard;
