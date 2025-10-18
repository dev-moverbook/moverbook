import { SegmentDistance } from "@/types/types";
import ListRowContainer from "../shared/containers/ListRowContainer";
import ListRow from "../shared/ui/ListRow";
import {
  sumSegments,
  formatMilesAndTime,
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

  const rows = [
    ...segmentDistances.map((seg) => ({
      label: seg.label,
      value: formatMilesAndTime(seg.distance ?? null, seg.duration ?? null),
      bold: false,
    })),
    {
      label: "Total",
      value: (() => {
        const milesPart = formatMiles(totalMiles);
        const timePart =
          totalMinutes == null ? null : formatDurationFromMinutes(totalMinutes);
        return timePart ? `${milesPart} (${timePart})` : milesPart;
      })(),
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
