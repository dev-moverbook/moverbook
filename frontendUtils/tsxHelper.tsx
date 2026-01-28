import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { isSameDayOrLater } from "./luxonUtils";
import { DisplayQuoteStatus, MoveStatus, StatusDisplay } from "@/types/types";
import { formatLocationType, hasPendingChangeRequest } from "./helper";

export const getQuoteStatusInfo = (
  quote: Doc<"quotes"> | null,
  moveStatus?: MoveStatus
): DisplayQuoteStatus => {
  if (quote?.status === "completed" || moveStatus === "Booked") {
    return {
      label: "Quote Complete",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
      isQuoted: true,
    };
  }

  if (quote?.status === "pending") {
    return {
      label: "Pending Customer",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      isQuoted: true,
    };
  }

  if (quote?.status === "customer_change") {
    return {
      label: "Customer Change",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      isQuoted: true,
    };
  }

  return {
    label: "Ready to Send",
    icon: <FileText className="w-4 h-4 text-gray-400" />,
    isQuoted: false,
  };
};

export const getSetUpStatus = (
  move: Doc<"moves">,
  assignedMovers: number,
  contract: Doc<"contracts"> | null,
  timeZone: string
): {
  label: string;
  icon: ReactNode;
} => {
  if (assignedMovers < (move.movers ?? 0)) {
    return {
      label: "Assignment Required",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    };
  }

  const showPreMove = isSameDayOrLater(move.moveDate ?? null, timeZone);

  if (!showPreMove) {
    return {
      label: "Awaiting Move Day",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
    };
  }

  if (!contract) {
    return {
      label: "Contract Ready To Send",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
    };
  }

  const { repSignature, customerSignature } = contract;

  if (repSignature && !customerSignature) {
    return {
      label: "Pending Customer Contract Signature",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    };
  }

  if (repSignature && customerSignature) {
    return {
      label: "Contract Signed",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
    };
  }

  return {
    label: "Booked",
    icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
  };
};

export const getInvoiceStatus = (
  invoice: Doc<"invoices"> | null,
  move: Doc<"moves">
): {
  label: string;
  icon: ReactNode;
} => {
  if (invoice?.status === "completed") {
    return {
      label: "Invoice Paid",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
    };
  } else if (invoice?.status === "pending") {
    return {
      label: "Invoice Pending",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    };
  } else if (
    !move.actualStartTime ||
    !move.actualArrivalTime ||
    !move.actualEndTime
  ) {
    return {
      label: "Move Times Not Set",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    };
  }

  return {
    label: "Invoice Ready To Send",
    icon: <FileText className="w-4 h-4 text-gray-400" />,
  };
};

export const getMoveStatus = (
  move: Doc<"moves">
): {
  label: string;
  icon: ReactNode;
} => {
  if (!move.actualStartTime) {
    return {
      label: "Awaiting Start",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    };
  }
  if (!move.actualArrivalTime) {
    return {
      label: "Awaiting Arrival",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    };
  }
  if (!move.actualEndTime) {
    return {
      label: "Awaiting End",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    };
  }

  return {
    label: "Move Completed",
    icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
  };
};

// To be deleted
export const getPublicQuoteStatus = (
  quote: Doc<"quotes"> | null
): DisplayQuoteStatus => {
  if (quote?.status === "completed") {
    return {
      label: "Quote Complete",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
      isQuoted: true,
    };
  }

  if (quote?.status === "pending") {
    return {
      label: "Signature Required",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      isQuoted: true,
    };
  }

  if (quote?.status === "customer_change") {
    return {
      label: "Requested Changes",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      isQuoted: true,
    };
  }

  return {
    label: "Awaiting Quote",
    icon: <FileText className="w-4 h-4 text-gray-400" />,
    isQuoted: false,
  };
};

// To be deleted
export const getPublicDocumentsStatus = (
  contract: Doc<"contracts"> | null,
  waiver: Doc<"waivers"> | null
): {
  label: string;
  icon: ReactNode;
} => {
  const isContractSigned = contract?.customerSignature;
  const isWaiverSigned = waiver?.customerSignature;
  const isContractReadyToSign = contract && !isContractSigned;
  const isWaiverReadyToSign = waiver && !isWaiverSigned;

  if (!contract && !waiver) {
    return {
      label: "Awaiting Documents",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
    };
  }

  if (isContractSigned && isWaiverSigned) {
    return {
      label: "Documents Signed",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
    };
  }

  if (isContractReadyToSign && isWaiverReadyToSign) {
    return {
      label: "Documents Ready To Sign",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
    };
  }

  if (isContractReadyToSign) {
    return {
      label: "Contract Ready To Sign",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    };
  }

  if (isWaiverReadyToSign) {
    return {
      label: "Waiver Ready To Sign",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    };
  }

  return {
    label: "Awaiting Documents",
    icon: <FileText className="w-4 h-4 text-gray-400" />,
  };
};

export const getCustomerInvoiceStatus = (
  invoice: Doc<"invoices"> | null
): {
  label: string;
  icon: ReactNode;
} => {
  if (!invoice) {
    return {
      label: "Awaiting Invoice",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
    };
  }

  if (invoice.customerSignature) {
    return {
      label: "Invoice Signed",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
    };
  }

  return {
    label: "Awaiting Payment",
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
  };
};

export interface PublicStatusParams {
  quote: Doc<"quotes"> | null;
  contract: Doc<"contracts"> | null;
  waiver: Doc<"waivers"> | null;
  move: Doc<"moves">;
  invoice: Doc<"invoices"> | null;
  changeRequests: Doc<"moveChangeRequests">[];
}

export const getPublicStatusDisplay = ({
  quote,
  contract,
  waiver,
  move,
  invoice,
  changeRequests,
}: PublicStatusParams): StatusDisplay | null => {
  if (move.moveStatus === "Completed") {
    return {
      label: "Move Completed",
      icon: <CheckCircle2 className="w-4 h-4 text-greenCustom" />,
      color: "green",
    };
  }
  const hasPendingChange = hasPendingChangeRequest(changeRequests);

  if (hasPendingChange) {
    return {
      label: "Change Request Pending",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      color: "yellow",
    };
  }

  if (quote?.status !== "completed") {
    if (quote?.status === "pending") {
      return {
        label: "Quote Signature Required",
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        color: "yellow",
      };
    }
    if (quote?.status === "customer_change") {
      return {
        label: "Quote Changes Requested",
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        color: "yellow",
      };
    }
    return {
      label: "Awaiting Quote",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
      color: "gray",
    };
  }

  const isContractSigned = !!contract?.customerSignature;
  const isWaiverSigned = !!waiver?.customerSignature;
  const isContractReadyToSign = contract && !isContractSigned;
  const isWaiverReadyToSign = waiver && !isWaiverSigned;

  if (!isContractSigned) {
    if (isContractReadyToSign || isWaiverReadyToSign) {
      if (isContractReadyToSign && isWaiverReadyToSign) {
        return {
          label: "Documents Ready To Sign",
          icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
          color: "yellow",
        };
      }
      return {
        label: isContractReadyToSign
          ? "Contract Signature Required"
          : "Waiver Signature Required",
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        color: "yellow",
      };
    }

    return {
      label: "Awaiting Documents Preparation",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
      color: "gray",
    };
  }

  if (!move.actualEndTime) {
    if (!move.actualStartTime) {
      return {
        label: "Awaiting Move Start",
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        color: "yellow",
      };
    }
    if (!move.actualArrivalTime) {
      return {
        label: "Awaiting Arrival",
        icon: <Clock className="w-4 h-4 text-gray-400" />,
        color: "gray",
      };
    }
    return {
      label: "Awaiting Move End",
      icon: <Clock className="w-4 h-4 text-gray-400" />,
      color: "gray",
    };
  }

  if (!invoice) {
    return {
      label: "Awaiting Final Invoice",
      icon: <FileText className="w-4 h-4 text-gray-400" />,
      color: "gray",
    };
  }

  if (!invoice.customerSignature) {
    return {
      label: "Awaiting Payment",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      color: "yellow",
    };
  }

  return null;
};

export const getMoveTags = (move: Doc<"moves">): string[] => {
  const tags = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    move.locations?.[0]
      ? formatLocationType(move.locations[0].locationType)
      : null,
  ];
  return tags.filter(Boolean) as string[];
};
