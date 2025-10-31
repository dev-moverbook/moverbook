import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { isSameDayOrLater } from "./luxonUtils";
import { MoveStatus } from "@/types/types";

export const getQuoteStatusInfo = (
  quote: Doc<"quotes"> | null,
  moveStatus: MoveStatus
): {
  label: string;
  icon: ReactNode;
  isQuoted: boolean;
} => {
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
  if (assignedMovers < move.movers) {
    return {
      label: "Assignment Required",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    };
  }

  const showPreMove = isSameDayOrLater(move.moveDate, timeZone);

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
