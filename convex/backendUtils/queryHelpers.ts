// helpers/resolveMoverContext.ts
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryCtx, MutationCtx } from "@/convex/_generated/server";
import { validateUser } from "./validate";
import { UserIdentity } from "convex/server";
import { getMoveCostRange } from "@/app/frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";

export type MoverContext = {
  isMover: boolean;
  moverId: Id<"users"> | null;
  hourlyRate: number | null;
};

type Ctx = QueryCtx | MutationCtx;

export async function resolveMoverContext(
  ctx: Ctx,
  identity: UserIdentity
): Promise<MoverContext> {
  if (identity.role === ClerkRoles.MOVER) {
    const user = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) =>
          q.eq("clerkUserId", identity.id as string)
        )
        .first()
    );

    const hourlyRate: number = user.hourlyRate || 0;

    return { isMover: true, moverId: user._id, hourlyRate };
  }

  return { isMover: false, moverId: null, hourlyRate: null };
}

export type MoveQueryFilters = {
  companyId: Id<"companies">;
  start: string;
  end: string;
  statuses?: string[];
  salesRepId?: Id<"users"> | null;
};

export async function getCompanyMoves(
  ctx: QueryCtx,
  { companyId, start, end, statuses, salesRepId }: MoveQueryFilters
): Promise<Doc<"move">[]> {
  let q = ctx.db
    .query("move")
    .withIndex("by_moveDate")
    .filter((f) =>
      f.and(
        f.eq(f.field("companyId"), companyId),
        f.gte(f.field("moveDate"), start),
        f.lte(f.field("moveDate"), end)
      )
    );

  if (statuses?.length) {
    q = q.filter((f) =>
      f.or(...statuses.map((s) => f.eq(f.field("moveStatus"), s)))
    );
  }

  if (salesRepId) {
    q = q.filter((f) => f.eq(f.field("salesRep"), salesRepId));
  }

  return q.collect();
}

type MoveWindow = Doc<"move">["moveWindow"];

export function filterByMoveWindow(
  moves: Doc<"move">[],
  windows?: MoveWindow[]
): Doc<"move">[] {
  if (!windows || windows.length === 0) {
    return moves;
  }

  return moves.filter((m) => windows.includes(m.moveWindow as MoveWindow));
}

export function sortByPriceOrder(
  moves: Doc<"move">[],
  priceOrder?: "asc" | "desc" | null
): Doc<"move">[] {
  if (!priceOrder) {
    return moves;
  }

  return [...moves].sort((a, b) => {
    const [aLow] = getMoveCostRange(a);
    const [bLow] = getMoveCostRange(b);
    return priceOrder === "asc" ? aLow - bLow : bLow - aLow;
  });
}

export async function getMoveCustomersMap(
  ctx: QueryCtx,
  moveCustomerIds: Id<"moveCustomers">[]
): Promise<Record<string, Doc<"moveCustomers">>> {
  if (moveCustomerIds.length === 0) return {};

  const uniqueIds = Array.from(new Set(moveCustomerIds));
  const customers = await ctx.db
    .query("moveCustomers")
    .filter((f) => f.or(...uniqueIds.map((id) => f.eq(f.field("_id"), id))))
    .collect();

  return Object.fromEntries(customers.map((c) => [c._id, c]));
}

export async function getUsersMapByIds(
  ctx: QueryCtx,
  userIds: Id<"users">[]
): Promise<Record<string, Doc<"users">>> {
  if (userIds.length === 0) return {};

  const uniqueIds = Array.from(new Set(userIds));
  const users = await ctx.db
    .query("users")
    .filter((f) => f.or(...uniqueIds.map((id) => f.eq(f.field("_id"), id))))
    .collect();

  return Object.fromEntries(users.map((u) => [u._id, u]));
}

export async function applyMoverScopeAndEstimateWages(
  ctx: QueryCtx,
  params: {
    moves: Doc<"move">[];
    moverId: Id<"users"> | null;
    hourlyRate: number | null;
  }
): Promise<{
  moves: Doc<"move">[];
  estimatedWageByMoveId: Map<string, number>;
}> {
  const { moves, moverId, hourlyRate } = params;

  const estimatedWageByMoveId = new Map<string, number>();
  if (!moverId || moves.length === 0) {
    return { moves, estimatedWageByMoveId };
  }

  const moveIds = moves.map((m) => m._id);
  const assignmentsForMover = await ctx.db
    .query("moveAssignments")
    .filter((f) =>
      f.and(
        f.eq(f.field("moverId"), moverId),
        f.or(...moveIds.map((id) => f.eq(f.field("moveId"), id)))
      )
    )
    .collect();

  const assignedMoveIds = new Set(assignmentsForMover.map((a) => a.moveId));
  const scopedMoves = moves.filter((m) => assignedMoveIds.has(m._id));

  const assignmentMap = new Map<string, Doc<"moveAssignments">>();
  for (const a of assignmentsForMover) {
    if (!assignmentMap.has(a.moveId)) assignmentMap.set(a.moveId, a);
  }

  for (const move of scopedMoves) {
    const a = assignmentMap.get(move._id);
    const startTime = a?.startTime ?? move.startingMoveTime ?? null;
    const endTime = a?.endTime ?? move.endingMoveTime ?? null;

    let workedHours = 0;
    if (
      typeof startTime === "number" &&
      typeof endTime === "number" &&
      endTime > startTime
    ) {
      workedHours = (endTime - startTime) / (1000 * 60 * 60);
    }

    const rate = hourlyRate ?? 0;
    estimatedWageByMoveId.set(
      move._id,
      Number((workedHours * rate).toFixed(2))
    );
  }

  return { moves: scopedMoves, estimatedWageByMoveId };
}

export function enrichMoves(
  moves: Doc<"move">[],
  opts: {
    moveCustomerMap: Record<string, Doc<"moveCustomers">>;
    salesRepMap: Record<string, Doc<"users">>;
    // accept the new map (optional for non-mover views)
    moverWageForMove?: Map<string, MoverWageForMove>;
    hourStatusMap?: HourStatusMap;
  }
): EnrichedMove[] {
  const { moveCustomerMap, salesRepMap, moverWageForMove, hourStatusMap } =
    opts;

  return moves.map((move) => ({
    ...move,
    moveCustomer: moveCustomerMap[move.moveCustomerId] ?? null,
    salesRepUser: move.salesRep ? (salesRepMap[move.salesRep] ?? null) : null,
    // attach per-move wage object if provided
    moverWageForMove: moverWageForMove?.get(move._id),
    hourStatus: hourStatusMap?.get(move._id),
  }));
}
export async function scopeMovesToMover(
  ctx: QueryCtx,
  moves: Doc<"move">[],
  moverId: Id<"users"> | null
): Promise<{
  moves: Doc<"move">[];
  assignmentMap: Map<string, Doc<"moveAssignments">>;
}> {
  if (!moverId || moves.length === 0) {
    return { moves, assignmentMap: new Map() };
  }

  const moveIds = moves.map((move) => move._id);
  const assignmentsForMover = await ctx.db
    .query("moveAssignments")
    .filter((filter) =>
      filter.and(
        filter.eq(filter.field("moverId"), moverId),
        filter.or(...moveIds.map((id) => filter.eq(filter.field("moveId"), id)))
      )
    )
    .collect();

  const assignedMoveIds = new Set(
    assignmentsForMover.map((assignment) => assignment.moveId)
  );
  const scopedMoves = moves.filter((move) => assignedMoveIds.has(move._id));

  const assignmentMap = new Map<string, Doc<"moveAssignments">>();
  for (const assignment of assignmentsForMover) {
    if (!assignmentMap.has(assignment.moveId)) {
      assignmentMap.set(assignment.moveId, assignment);
    }
  }
  return { moves: scopedMoves, assignmentMap };
}

export type WageRange = { min: number; max: number };
export type WageRangeMap = Map<string, WageRange>;

function getTravelHours(move: Doc<"move">): number {
  if (
    !Array.isArray(move.segmentDistances) ||
    move.segmentDistances.length === 0
  ) {
    return 0;
  }
  let total = 0;
  for (const segment of move.segmentDistances) {
    if (typeof segment?.duration === "number" && segment.duration > 0) {
      total += segment.duration; // durations are stored in hours
    }
  }
  return total;
}

export function buildEstimatedWageRangeMap(
  moves: Doc<"move">[],
  assignmentMap: Map<string, Doc<"moveAssignments">>,
  hourlyRate: number | null
): WageRangeMap {
  const wageMap: WageRangeMap = new Map();
  const rate = hourlyRate ?? 0;

  const fix2 = (n: number) => Number(n.toFixed(2));
  const hoursNonNeg = (n: number) => Math.max(0, n);

  for (const move of moves) {
    const assignment = assignmentMap.get(move._id);
    const travelHours = hoursNonNeg(getTravelHours(move));

    if (move.jobType === "flat") {
      const flatBase = fix2(move.jobTypeRate ?? 0);
      const travelPay = fix2(travelHours * rate);
      const total = fix2(flatBase + travelPay);
      wageMap.set(move._id, { min: total, max: total });
      continue;
    }

    if (move.jobType === "hourly") {
      if (move.moveStatus === "Completed") {
        let workedHours = 0;

        if (
          typeof assignment?.startTime === "number" &&
          typeof assignment?.endTime === "number" &&
          assignment.endTime > assignment.startTime
        ) {
          const breakHrs = hoursNonNeg(assignment.breakAmount ?? 0);
          workedHours = hoursNonNeg(
            assignment.endTime - assignment.startTime - breakHrs
          );
        } else if (
          typeof move.actualStartTime === "number" &&
          typeof move.actualEndTime === "number" &&
          move.actualEndTime > move.actualStartTime
        ) {
          // Fallback to move actuals if assignment missing
          workedHours = hoursNonNeg(move.actualEndTime - move.actualStartTime);
        } else {
          workedHours = 0;
        }

        const totalHours = hoursNonNeg(workedHours) + travelHours;
        const total = fix2(totalHours * rate);
        wageMap.set(move._id, { min: total, max: total });
        continue;
      }

      // ⏳ Not completed: estimate range using assignment start/end if provided, else move’s window
      const startHours =
        (typeof assignment?.startTime === "number"
          ? assignment.startTime
          : move.startingMoveTime) ?? null;

      const endHours =
        (typeof assignment?.endTime === "number"
          ? assignment.endTime
          : move.endingMoveTime) ?? null;

      let minHours = 0;
      let maxHours = 0;
      if (typeof startHours === "number") minHours = hoursNonNeg(startHours);
      if (typeof endHours === "number") maxHours = hoursNonNeg(endHours);
      if (maxHours < minHours) {
        const tmp = minHours;
        minHours = maxHours;
        maxHours = tmp;
      }

      // For estimates, we don’t subtract break since end may be unknown; keep it simple/optimistic.
      const estMinTotalHours = minHours + travelHours;
      const estMaxTotalHours = maxHours + travelHours;

      const minWage = fix2(estMinTotalHours * rate);
      const maxWage = fix2(estMaxTotalHours * rate);
      wageMap.set(move._id, { min: minWage, max: maxWage });
      continue;
    }

    // Fallback for unknown jobType
    wageMap.set(move._id, { min: 0, max: 0 });
  }

  return wageMap;
}

export type HourStatus = "pending" | "approved" | "rejected";
export type HourStatusMap = Map<string, HourStatus | undefined>;
export type MyWage = {
  estimated: number | null;
  final: number | null;
};

function msToHours(valueMs: number): number {
  return valueMs / (1000 * 60 * 60);
}

function toHoursUnknownUnit(value: number): number {
  return value > 10_000 ? msToHours(value) : value;
}

function clampNonNegative(value: number): number {
  return value < 0 ? 0 : value;
}

function computeCompletedAssignmentHours(
  assignment?: Doc<"moveAssignments">
): number {
  if (!assignment) return 0;

  const startRaw = assignment.startTime ?? null;
  const endRaw = assignment.endTime ?? null;
  const breakMinutes = assignment.breakAmount ?? 0;

  if (
    typeof startRaw !== "number" ||
    typeof endRaw !== "number" ||
    endRaw <= startRaw
  ) {
    return 0;
  }

  const startHours = toHoursUnknownUnit(startRaw);
  const endHours = toHoursUnknownUnit(endRaw);
  const breakHours = clampNonNegative(breakMinutes / 60);

  return clampNonNegative(endHours - startHours - breakHours);
}

function computeFlatTotal(move: Doc<"move">, hourlyRate: number): number {
  const travelHours = getTravelHours(move);
  const flatBase = Number((move.jobTypeRate ?? 0).toFixed(2));
  const travelPay = Number((travelHours * hourlyRate).toFixed(2));
  return Number((flatBase + travelPay).toFixed(2));
}

function computeHourlyCompletedTotal(
  assignment: Doc<"moveAssignments"> | undefined,
  hourlyRate: number
): number {
  const workedHours = computeCompletedAssignmentHours(assignment);
  return Number((workedHours * hourlyRate).toFixed(2));
}

function computeHourlyRangeEstimated(
  move: Doc<"move">,
  assignment: Doc<"moveAssignments"> | undefined,
  hourlyRate: number
): WageRange {
  const travelHours = getTravelHours(move);

  const startCandidate =
    (typeof assignment?.startTime === "number"
      ? toHoursUnknownUnit(assignment.startTime)
      : move.startingMoveTime) ?? null;

  const endCandidate =
    (typeof assignment?.endTime === "number"
      ? toHoursUnknownUnit(assignment.endTime)
      : move.endingMoveTime) ?? null;

  let minHours = 0;
  let maxHours = 0;

  if (typeof startCandidate === "number")
    minHours = clampNonNegative(startCandidate);
  if (typeof endCandidate === "number")
    maxHours = clampNonNegative(endCandidate);

  if (maxHours < minHours) {
    const tmp = minHours;
    minHours = maxHours;
    maxHours = tmp;
  }

  const estMinTotalHours = clampNonNegative(minHours + travelHours);
  const estMaxTotalHours = clampNonNegative(maxHours + travelHours);

  return {
    min: Number((estMinTotalHours * hourlyRate).toFixed(2)),
    max: Number((estMaxTotalHours * hourlyRate).toFixed(2)),
  };
}

export function buildEstimatedWageAndStatusMaps(
  moves: Doc<"move">[],
  assignmentMap: Map<string, Doc<"moveAssignments">>,
  hourlyRateInput: number | null
): { wageMap: WageRangeMap; hourStatusMap: HourStatusMap } {
  const wageMap: WageRangeMap = new Map();
  const hourStatusMap: HourStatusMap = new Map();
  const rate = hourlyRateInput ?? 0;

  for (const move of moves) {
    const assignment = assignmentMap.get(move._id);

    if (move.jobType === "flat") {
      const total = computeFlatTotal(move, rate);
      wageMap.set(move._id, { min: total, max: total });
      hourStatusMap.set(
        move._id,
        assignment?.hourStatus as HourStatus | undefined
      );
      continue;
    }

    if (move.jobType === "hourly") {
      if (move.moveStatus === "Completed") {
        const total = computeHourlyCompletedTotal(assignment, rate);
        wageMap.set(move._id, { min: total, max: total });
        hourStatusMap.set(
          move._id,
          assignment?.hourStatus as HourStatus | undefined
        );
        continue;
      }

      const range = computeHourlyRangeEstimated(move, assignment, rate);
      wageMap.set(move._id, range);
      hourStatusMap.set(
        move._id,
        assignment?.hourStatus as HourStatus | undefined
      );
      continue;
    }

    wageMap.set(move._id, { min: 0, max: 0 });
    hourStatusMap.set(
      move._id,
      assignment?.hourStatus as HourStatus | undefined
    );
  }

  return { wageMap, hourStatusMap };
}

export function buildWageAndStatusForMove(
  move: Doc<"move">,
  assignment: Doc<"moveAssignments">,
  hourlyRateInput: number | null
): { wage: WageRange; hourStatus?: HourStatus } {
  const rate = hourlyRateInput ?? 0;

  const isCompleted = move.moveStatus === "Completed";

  if (move.jobType === "flat") {
    const total = computeFlatTotal(move, rate);
    return {
      wage: { min: total, max: total },
      hourStatus: assignment?.hourStatus as HourStatus | undefined,
    };
  }

  if (move.jobType === "hourly") {
    if (move.moveStatus === "Completed") {
      const total = computeHourlyCompletedTotal(assignment, rate);
      return {
        wage: { min: total, max: total },
        hourStatus: assignment?.hourStatus as HourStatus | undefined,
      };
    }

    const range = computeHourlyRangeEstimated(move, assignment, rate);
    return {
      wage: range,
      hourStatus: assignment?.hourStatus as HourStatus | undefined,
    };
  }

  return {
    wage: { min: 0, max: 0 },
    hourStatus: assignment?.hourStatus as HourStatus | undefined,
  };
}

export function toMyWage(
  moveStatus: Doc<"move">["moveStatus"],
  wage: WageRange
): MyWage {
  const isFinal = moveStatus === "Completed";
  if (isFinal) {
    return { estimated: null, final: wage.max };
  }
  const estimated = wage.max;
  return { estimated, final: null };
}

// types you gave
export type MoverWageForMove = {
  estimatedMin: number | null;
  estimatedMax: number | null;
  pendingPayout: number | null;
  pendingHours: number | null;
  approvedPayout: number | null;
  approvedHours: number | null;
};

// --- tiny utils ---
const round2 = (n: number) => Number(n.toFixed(2));
const hoursBetweenMs = (start?: number | null, end?: number | null) =>
  typeof start === "number" && typeof end === "number"
    ? Math.max(0, (end - start) / (1000 * 60 * 60))
    : 0;

const workedHoursFromAssignment = (a: {
  startTime?: number | null;
  endTime?: number | null;
  breakAmount?: number | null;
}) => {
  const raw = hoursBetweenMs(a.startTime ?? null, a.endTime ?? null);
  const breakHrs = Math.max(0, a.breakAmount ?? 0);
  return raw > 0 ? round2(Math.max(0, raw - breakHrs)) : null;
};

/**
 * Build the display wage object for a mover on a given move.
 * - If move is Completed:
 *    - hourStatus === "approved" -> use approvedHours/approvedPay (fallback to calc)
 *    - hourStatus === "pending" | "rejected" -> put calculated hours*rate into "pending*"
 * - Otherwise:
 *    - Fill only estimatedMin/Max (using your existing estimator)
 */
export function buildMoverWageForMoveDisplay(
  move: Doc<"move">,
  assignment: Doc<"moveAssignments">,
  hourlyRateInput: number | null
): MoverWageForMove {
  const hourlyRate = Math.max(0, hourlyRateInput ?? 0);

  // default empty shape
  const out: MoverWageForMove = {
    estimatedMin: null,
    estimatedMax: null,
    pendingPayout: null,
    pendingHours: null,
    approvedPayout: null,
    approvedHours: null,
  };

  // If the move is finished, show final (approved or pending/rejected)
  const isCompleted = move.moveStatus === "Completed";

  if (isCompleted) {
    // APPROVED → use approved fields; if missing, derive from timestamps
    if (assignment.hourStatus === "approved") {
      const hrs =
        typeof assignment.approvedHours === "number"
          ? round2(Math.max(0, assignment.approvedHours))
          : workedHoursFromAssignment(assignment);

      const pay =
        typeof assignment.approvedPay === "number"
          ? round2(Math.max(0, assignment.approvedPay))
          : hrs != null
            ? round2(hrs * hourlyRate)
            : null;

      out.approvedHours = hrs;
      out.approvedPayout = pay;
      return out;
    }

    // PENDING or REJECTED → compute as “pending”
    if (
      assignment.hourStatus === "pending" ||
      assignment.hourStatus === "rejected"
    ) {
      const hrs = workedHoursFromAssignment(assignment);
      const pay = hrs != null ? round2(hrs * hourlyRate) : null;
      out.pendingHours = hrs;
      out.pendingPayout = pay;
      return out;
    }

    // Unknown status on a completed move → fall back to pending-style calc
    const hrs = workedHoursFromAssignment(assignment);
    const pay = hrs != null ? round2(hrs * hourlyRate) : null;
    out.pendingHours = hrs;
    out.pendingPayout = pay;
    return out;
  }

  // Not completed → show estimates only
  if (move.jobType === "hourly") {
    const est = computeHourlyRangeEstimated(move, assignment, hourlyRate);
    out.estimatedMin = est.min;
    out.estimatedMax = est.max;
  } else {
    // If you pay movers hourly even on flat jobs, you could optionally
    // estimate using starting/ending hours here. Otherwise keep as nulls.
    out.estimatedMin = null;
    out.estimatedMax = null;
  }

  return out;
}
