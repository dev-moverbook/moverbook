import CustomCard from "@/components/shared/card/CustomCard";
import { Doc } from "@/convex/_generated/dataModel";
import {
  formatAccessType,
  formatMoveSize,
  formatLocationType,
  formatStopBehaviorTags,
  getLocationLabel,
} from "@/frontendUtils/helper";
import CardHeaderWithActions from "@/components/shared/card/CardHeaderWithActions";
import { Badge } from "@/components/ui/badge";

type MoveLocation = Doc<"moves">["locations"][number];

interface QuoteLocationCardProps {
  location: MoveLocation;
  index: number;
  locationLength: number;
}

const QuoteLocationCard = ({
  location,
  index,
  locationLength,
}: QuoteLocationCardProps) => {
  const {
    address,
    moveSize,
    accessType,
    locationType,
    stopBehavior,
    locationRole,
  } = location;

  const title = getLocationLabel(index, locationLength);
  const locationTags = [
    ...(locationRole !== "ending" && moveSize
      ? [formatMoveSize(moveSize)]
      : []),
    formatAccessType(accessType),
    formatLocationType(locationType),
    ...formatStopBehaviorTags(stopBehavior),
  ];

  return (
    <CustomCard className="flex flex-col justify-between gap-4 p-4">
      <CardHeaderWithActions title={title} className="p-0" />
      <div>
        <p>{address?.formattedAddress ?? "—"}</p>
        {locationTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {locationTags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </CustomCard>
  );
};

export default QuoteLocationCard;
