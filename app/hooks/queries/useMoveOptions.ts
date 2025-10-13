import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GetMoveOptionsData } from "@/types/convex-responses";
import { useSlugContext } from "@/app/contexts/SlugContext";

export const useMoveOptions = (): GetMoveOptionsData | undefined => {
  const { companyId } = useSlugContext();

  const response = useQuery<typeof api.move.getMoveOptions>(
    api.move.getMoveOptions,
    { companyId }
  );

  return response;
};
