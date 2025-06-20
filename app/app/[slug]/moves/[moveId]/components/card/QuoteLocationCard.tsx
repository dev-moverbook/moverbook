import React from "react";
import CustomCard from "@/app/components/shared/CustomCard";
import { MoveLocation } from "@/types/convex-schemas";
import {
  formatAccessType,
  formatMoveSize,
  formatMoveType,
  formatStopBehaviorTags,
  getLocationLabel,
} from "@/app/frontendUtils/helper";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import { Badge } from "@/components/ui/badge";

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
  const { address, moveSize, accessType, moveType, stopBehavior } = location;
  const title = getLocationLabel(index, locationLength);
  const locationTags = [
    formatMoveSize(moveSize),
    formatAccessType(accessType),
    formatMoveType(moveType),
    ...formatStopBehaviorTags(stopBehavior),
  ];
  return (
    <CustomCard className="flex flex-col justify-between gap-4 p-4">
      <CardHeaderWithActions title={title} className="p-0" />
      <div>
        <p>{address}</p>
        {locationTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {locationTags.map((tag, i) => (
              <Badge key={i} className="  ">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </CustomCard>
  );
};

export default QuoteLocationCard;
