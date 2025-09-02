import React from "react";
import {
  formatHourStatus,
  formatTwoDecimals,
  statusColorMap,
} from "@/app/frontendUtils/helper";
import ReusableCard from "@/app/app/[slug]/moves/[moveId]/components/card/ReusableCard";
import { Doc } from "@/convex/_generated/dataModel";
import { MoverWageForMove } from "@/convex/backendUtils/queryHelpers";

interface PayOutCardProps {
  moveAssignment: Doc<"moveAssignments">;
  wageDisplay: MoverWageForMove | null;
}

const PayOutCard = ({ moveAssignment, wageDisplay }: PayOutCardProps) => {
  if (!moveAssignment.endTime || !moveAssignment.startTime) {
    return null;
  }

  let totalHours: number | null = null;

  if (moveAssignment.hourStatus === "approved") {
    totalHours = wageDisplay?.approvedHours ?? 0;
  } else {
    totalHours = wageDisplay?.pendingHours ?? 0;
  }

  let totalPayout: number | null = null;

  if (moveAssignment.hourStatus === "approved") {
    totalPayout = wageDisplay?.approvedPayout ?? 0;
  } else {
    totalPayout = wageDisplay?.pendingPayout ?? 0;
  }

  const status = formatHourStatus(moveAssignment.hourStatus);

  const texts: [string, string | number | null, any?][] = [
    ["Total Hours", formatTwoDecimals(totalHours, "hours")],
    ["Total Payout", totalPayout, { isCurrency: true }],
    [
      "Status",
      status,
      {
        valueClassName:
          statusColorMap[status.toLowerCase() as keyof typeof statusColorMap],
      },
    ],
  ];

  if (moveAssignment.managerNotes) {
    texts.push(["Manager Notes", moveAssignment.managerNotes]);
  }

  return <ReusableCard title="Payout Summary" texts={texts} />;
};

export default PayOutCard;
