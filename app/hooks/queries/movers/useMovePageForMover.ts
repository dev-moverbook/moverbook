import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import {
  GetMovePageForMoverLeadData,
  GetMovePageForMoverMemberData,
} from "@/types/convex-responses";

type MovePageForMoverMember = {
  isLead: false;
  assignment: Doc<"moveAssignments">;
};

type MovePageForMoverLead = {
  isLead: true;
  assignment: Doc<"moveAssignments">;
  preMoveDoc: Doc<"preMoveDocs"> | null;
  discounts: Doc<"discounts">[];
  additionalFees: Doc<"additionalFees">[];
  invoice: Doc<"invoices"> | null;
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
  fees: Doc<"fees">[];
};

export const useMovePageForMover = (
  moveId: Id<"move">
): GetMovePageForMoverMemberData | GetMovePageForMoverLeadData | undefined => {
  const response = useQuery(api.moveAssignments.getMovePageForMover, {
    moveId,
  });

  return response;
};
