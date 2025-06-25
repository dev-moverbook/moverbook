import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MoveSchema } from "@/types/convex-schemas";
import { ResponseStatus } from "@/types/enums";
import { MoveStatus, PriceOrder } from "@/types/types";

interface UseMovesForCalendarParams {
  start: string;
  end: string;
  companyId: Id<"companies"> | null;
  statuses?: MoveStatus[];
  salesRepId?: Id<"users"> | null;
  priceOrder?: PriceOrder | null;
}

interface UseMovesForCalendarResult {
  data: MoveSchema[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useMovesForCalendar = ({
  start,
  end,
  companyId,
  statuses,
  salesRepId,
  priceOrder,
}: UseMovesForCalendarParams): UseMovesForCalendarResult => {
  const response = useQuery<typeof api.move.getMovesForCalendar>(
    api.move.getMovesForCalendar,
    companyId
      ? { start, end, companyId, statuses, salesRepId, priceOrder }
      : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  const data =
    response?.status === ResponseStatus.SUCCESS ? response.data.moves : [];

  return {
    data,
    isLoading,
    isError,
    errorMessage: isError ? (response?.error ?? "Failed to load moves.") : null,
  };
};
