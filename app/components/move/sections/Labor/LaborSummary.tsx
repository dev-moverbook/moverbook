"use client";

import React from "react";
import ListRowContainer from "@/app/components/shared/containers/ListRowContainer";
import ListRow from "@/app/components/shared/ui/ListRow";
import {
  formatDisplayNumber,
  getTotalHoursRange,
} from "@/app/frontendUtils/helper";
import { LaborFormData } from "../LaborSection";

type LaborSummaryProps = {
  formData: LaborFormData;
  roundTripDrive?: number | null;
};

const LaborSummary: React.FC<LaborSummaryProps> = ({
  formData,
  roundTripDrive,
}) => {
  return (
    <ListRowContainer className="mb-4">
      <ListRow
        left="Labor Time"
        right={`${formData.startingMoveTime}-${formData.endingMoveTime} hours`}
        className="bg-background2 border-grayCustom border-t"
      />
      <ListRow
        left="Drive Time"
        right={
          roundTripDrive ? `${formatDisplayNumber(roundTripDrive, "hrs")}` : ""
        }
        className=""
      />
      <ListRow
        left="Total Estimate Time"
        right={getTotalHoursRange(
          formData.startingMoveTime ?? 0,
          formData.endingMoveTime ?? 0,
          roundTripDrive ?? 0
        )}
        className="bg-background2  border-grayCustom"
        bold
      />
    </ListRowContainer>
  );
};

export default LaborSummary;
