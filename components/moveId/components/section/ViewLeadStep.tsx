"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { hasRequiredMoveFields } from "@/frontendUtils/helper";
import StepStatus from "../shared/StepStatus";

const ViewLeadStep = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const moveCustomer = moveData.moveCustomer;

  const isComplete = hasRequiredMoveFields(move, moveCustomer);
  const leadStatus = isComplete
    ? "Information Complete"
    : "Missing Information";
  const leadStatusIcon = isComplete ? (
    <CheckCircle2 className="w-4 h-4 text-greenCustom" />
  ) : (
    <AlertTriangle className="w-4 h-4 text-yellow-500" />
  );
  return (
    <StepStatus
      items={[
        {
          label: "Lead Status",
          value: leadStatus,
          icon: leadStatusIcon,
        },
      ]}
    />
  );
};

export default ViewLeadStep;
