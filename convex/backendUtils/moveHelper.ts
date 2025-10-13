import { HourStatus } from "@/types/types";
import { DataModel, Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import {
  buildMoverWageForMoveDisplay,
  getMoveCustomersMap,
  getUsersMapByIds,
  HourStatusMap,
  MoverWageForMove,
  scopeMovesToMover,
} from "./queryHelpers";

type MoverWageByMoveId = Map<Id<"move">, MoverWageForMove>;

function recordToIdMap<TTable extends keyof DataModel>(
  record: Record<string, Doc<TTable>>
): Map<Id<TTable>, Doc<TTable>> {
  return new Map(
    Object.entries(record).map(([rawId, doc]) => [rawId as Id<TTable>, doc])
  );
}

export async function buildReferenceMaps(
  ctx: QueryCtx,
  moves: Doc<"move">[]
): Promise<{
  moveCustomerMap: Map<Id<"moveCustomers">, Doc<"moveCustomers">>;
  salesRepMap: Map<Id<"users">, Doc<"users">>;
}> {
  const moveCustomerIds = Array.from(
    new Set(moves.map((move) => move.moveCustomerId))
  );

  const moveCustomersRecord = await getMoveCustomersMap(ctx, moveCustomerIds);
  const moveCustomerMap = recordToIdMap<"moveCustomers">(moveCustomersRecord);

  const uniqueSalesRepIds = Array.from(
    new Set(moves.map((move) => move.salesRep).filter(Boolean))
  ) as Id<"users">[];

  const salesRepsRecord = await getUsersMapByIds(ctx, uniqueSalesRepIds);
  const salesRepMap = recordToIdMap<"users">(salesRepsRecord);

  return { moveCustomerMap, salesRepMap };
}

export async function scopeToMoverIfNeeded(
  ctx: QueryCtx,
  baseMoves: Doc<"move">[],
  selfMoverId: Id<"users"> | undefined,
  isMover: boolean,
  selfHourlyRate: number | undefined
): Promise<{
  scopedMoves: Doc<"move">[];
  moverWageByMoveId: MoverWageByMoveId;
  hourStatusByMoveId: HourStatusMap;
  isScopedToMover: boolean;
}> {
  if (!isMover || !selfMoverId) {
    return {
      scopedMoves: baseMoves,
      moverWageByMoveId: new Map<Id<"move">, MoverWageForMove>(),
      hourStatusByMoveId: new Map(),
      isScopedToMover: false,
    };
  }

  const { moves, assignmentMap } = await scopeMovesToMover(
    ctx,
    baseMoves,
    selfMoverId
  );

  const moverWageByMoveId: MoverWageByMoveId = new Map();
  const hourStatusByMoveId: HourStatusMap = new Map();

  for (const move of moves) {
    const assignment = assignmentMap.get(move._id);

    if (assignment && selfHourlyRate !== undefined) {
      const wageDisplay = buildMoverWageForMoveDisplay(
        move,
        assignment,
        selfHourlyRate
      );
      moverWageByMoveId.set(move._id, wageDisplay);
    }

    const hourStatus = assignmentMap.get(move._id)?.hourStatus as
      | HourStatus
      | undefined;
    hourStatusByMoveId.set(move._id, hourStatus);
  }

  return {
    scopedMoves: moves,
    moverWageByMoveId,
    hourStatusByMoveId,
    isScopedToMover: true,
  };
}
