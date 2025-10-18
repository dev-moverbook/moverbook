"use client";

import React from "react";
import ListRowContainer from "@/components/shared/containers/ListRowContainer";
import ListRow from "@/components/shared/ui/ListRow";
import {
  formatDisplayNumber,
  getTotalHoursRange,
  roundToTwoDecimals,
} from "@/frontendUtils/helper";
import { LaborFormData } from "../LaborSection";

type LaborSummaryProps = {
  formData: LaborFormData;
  totalDriveTime: number | null;
};

const LaborSummary: React.FC<LaborSummaryProps> = ({
  formData,
  totalDriveTime,
}) => {
  const hours = totalDriveTime ? roundToTwoDecimals(totalDriveTime / 60) : 0;

  return (
    <ListRowContainer className="mb-4">
      <ListRow
        left="Labor Time"
        right={`${formData.startingMoveTime}-${formData.endingMoveTime} hours`}
        className="bg-background2 border-grayCustom border-t"
      />
      <ListRow
        left="Drive Time"
        right={totalDriveTime ? `${formatDisplayNumber(hours, "hours")}` : ""}
        className=""
      />
      <ListRow
        left="Total Estimate Time"
        right={getTotalHoursRange(
          formData.startingMoveTime ?? 0,
          formData.endingMoveTime ?? 0,
          hours
        )}
        className="bg-background2  border-grayCustom"
        bold
      />
    </ListRowContainer>
  );
};

export default LaborSummary;
