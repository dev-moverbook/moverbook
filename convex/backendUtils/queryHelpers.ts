import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryCtx, MutationCtx } from "@/convex/_generated/server";
import { validateUser } from "./validate";
import { UserIdentity } from "convex/server";
import {
  getMoveCostRange,
  roundToTwoDecimals,
  sumSegments,
} from "@/frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";
import { HourStatus, MoveStatus } from "@/types/types";

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
    const userId = identity.convexId as Id<"users">;
    const user = validateUser(await ctx.db.get(userId));

    const hourlyRate: number = user.hourlyRate || 0;

    return { isMover: true, moverId: user._id, hourlyRate };
  }

  return { isMover: false, moverId: null, hourlyRate: null };
}

export type MoveQueryFilters = {
  companyId: Id<"companies">;
  start: string;
  end: string;
  statuses?: MoveStatus[];
  salesRepId?: Id<"users"> | null;
  referralId?: Id<"referrals"> | null;
  serviceType?: Doc<"moves">["serviceType"] | null;
  moveSize?: Doc<"moves">["locations"][number]["moveSize"] | null;
  numberOfMovers?: number | null;
  locationType?: Doc<"moves">["locations"][number]["locationType"] | null;
};

export async function getCompanyMoves(
  context: QueryCtx,
  {
    companyId,
    start,
    end,
    statuses,
    salesRepId,
    referralId,
    serviceType,
    moveSize,
    numberOfMovers,
    locationType,
  }: MoveQueryFilters
): Promise<Doc<"moves">[]> {
  let moveQuery = context.db
    .query("moves")
    .withIndex("by_moveDate", (range) =>
      range.gte("moveDate", start).lte("moveDate", end)
    )
    .filter((filter) => filter.eq(filter.field("companyId"), companyId));

  if (statuses?.length) {
    moveQuery = moveQuery.filter((filter) =>
      filter.or(
        ...statuses.map((status) =>
          filter.eq(filter.field("moveStatus"), status)
        )
      )
    );
  }

  if (salesRepId) {
    moveQuery = moveQuery.filter((filter) =>
      filter.eq(filter.field("salesRep"), salesRepId)
    );
  }

  if (referralId) {
    moveQuery = moveQuery.filter((filter) =>
      filter.eq(filter.field("referralId"), referralId)
    );
  }

  if (serviceType ?? null) {
    moveQuery = moveQuery.filter((filter) =>
      filter.eq(filter.field("serviceType"), serviceType)
    );
  }

  if (typeof numberOfMovers === "number") {
    moveQuery = moveQuery.filter((filter) =>
      filter.eq(filter.field("movers"), numberOfMovers)
    );
  }

  const moves = await moveQuery.collect();

  if (moveSize == null && locationType == null) {
    return moves;
  }

  const filteredByFirstLocation = moves.filter((move) => {
    const firstLocation = move.locations?.[0];
    if (!firstLocation) {
      return false;
    }
    if (moveSize != null && firstLocation.moveSize !== moveSize) {
      return false;
    }
    if (locationType != null && firstLocation.locationType !== locationType) {
      return false;
    }
    return true;
  });

  return filteredByFirstLocation;
}

type MoveWindow = Doc<"moves">["moveWindow"];

export function filterByMoveWindow(
  moves: Doc<"moves">[],
  windows?: MoveWindow[]
): Doc<"moves">[] {
  if (!windows || windows.length === 0) {
    return moves;
  }

  return moves.filter((m) => windows.includes(m.moveWindow as MoveWindow));
}

export function sortByPriceOrder(
  moves: Doc<"moves">[],
  priceOrder?: "asc" | "desc" | null
): Doc<"moves">[] {
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
    moves: Doc<"moves">[];
    moverId: Id<"users"> | null;
    hourlyRate: number | null;
  }
): Promise<{
  moves: Doc<"moves">[];
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
  moves: Doc<"moves">[],
  opts: {
    moveCustomerMap: Record<string, Doc<"moveCustomers">>;
    salesRepMap: Record<string, Doc<"users">>;
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
    moverWageForMove: moverWageForMove?.get(move._id),
    hourStatus: hourStatusMap?.get(move._id),
  }));
}
export async function scopeMovesToMover(
  ctx: QueryCtx,
  moves: Doc<"moves">[],
  moverId: Id<"users"> | null
): Promise<{
  moves: Doc<"moves">[];
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

function getTravelHours(move: Doc<"moves">): number {
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
  moves: Doc<"moves">[],
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

function computeFlatTotal(move: Doc<"moves">, hourlyRate: number): number {
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
  move: Doc<"moves">,
  assignment: Doc<"moveAssignments"> | undefined,
  hourlyRate: number
): WageRange {
  const segmentDistances = move.segmentDistances;
  const travelMinutes = sumSegments(segmentDistances).totalMinutes;
  const travelHours = travelMinutes ? travelMinutes / 60 : 0;

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
  moves: Doc<"moves">[],
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
  move: Doc<"moves">,
  assignment: Doc<"moveAssignments">,
  hourlyRateInput: number | null
): { wage: WageRange; hourStatus?: HourStatus } {
  const rate = hourlyRateInput ?? 0;

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
  moveStatus: Doc<"moves">["moveStatus"],
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
  return raw > 0 ? roundToTwoDecimals(Math.max(0, raw - breakHrs)) : null;
};

export function buildMoverWageForMoveDisplay(
  move: Doc<"moves">,
  assignment: Doc<"moveAssignments">,
  hourlyRateInput: number | null
): MoverWageForMove {
  const hourlyRate = Math.max(0, hourlyRateInput ?? 0);

  const wageSummary: MoverWageForMove = {
    estimatedMin: null,
    estimatedMax: null,
    pendingPayout: null,
    pendingHours: null,
    approvedPayout: null,
    approvedHours: null,
  };

  const mode = determineMode(assignment);
  switch (mode) {
    case "APPROVED":
      return fillApproved(wageSummary, assignment, hourlyRate);
    case "PENDING":
      return fillPending(wageSummary, assignment, hourlyRate);
    case "ESTIMATE":
      return fillEstimate(wageSummary, move, assignment, hourlyRate);
  }
}

function determineMode(
  assignment: Doc<"moveAssignments">
): "APPROVED" | "PENDING" | "ESTIMATE" {
  const hasBothTimes =
    typeof assignment.startTime === "number" &&
    typeof assignment.endTime === "number";

  const hasApproved =
    assignment.hourStatus === "approved" ||
    typeof assignment.approvedHours === "number" ||
    typeof assignment.approvedPay === "number";

  if (hasApproved) return "APPROVED";

  if (hasBothTimes) {
    return "PENDING";
  }

  return "ESTIMATE";
}

function fillApproved(
  summary: MoverWageForMove,
  assignment: Doc<"moveAssignments">,
  hourlyRate: number
): MoverWageForMove {
  let hrs: number | null = null;
  if (typeof assignment.approvedHours === "number") {
    hrs = roundToTwoDecimals(Math.max(0, assignment.approvedHours));
  } else if (hasBothTimes(assignment)) {
    hrs = workedHoursFromAssignment(assignment);
  }

  let pay: number | null = null;
  if (typeof assignment.approvedPay === "number") {
    pay = roundToTwoDecimals(Math.max(0, assignment.approvedPay));
  } else if (hrs != null) {
    pay = roundToTwoDecimals(hrs * hourlyRate);
  }

  return {
    ...summary,
    approvedHours: hrs,
    approvedPayout: pay,
  };
}

function fillPending(
  summary: MoverWageForMove,
  assignment: Doc<"moveAssignments">,
  hourlyRate: number
): MoverWageForMove {
  const hrs = workedHoursFromAssignment(assignment);
  const pay = hrs != null ? roundToTwoDecimals(hrs * hourlyRate) : null;

  return {
    ...summary,
    pendingHours: hrs,
    pendingPayout: pay,
  };
}

function fillEstimate(
  summary: MoverWageForMove,
  move: Doc<"moves">,
  assignment: Doc<"moveAssignments">,
  hourlyRate: number
): MoverWageForMove {
  const est = computeHourlyRangeEstimated(move, assignment, hourlyRate);

  return {
    ...summary,
    estimatedMin: est.min,
    estimatedMax: est.max,
  };
}

function hasBothTimes(assignment: Doc<"moveAssignments">): boolean {
  return (
    typeof assignment.startTime === "number" &&
    typeof assignment.endTime === "number"
  );
}

export function matchesFilters(
  moveRecord: Doc<"moves">,
  salesRepId: Id<"users"> | null,
  referralId: Id<"referrals"> | null
): boolean {
  if (salesRepId && moveRecord.salesRep !== salesRepId) {
    return false;
  }
  if (referralId && moveRecord.referralId !== referralId) {
    return false;
  }
  return true;
}

function isWithinRange(
  epochMillis: number | null | undefined,
  startTime: number,
  endTime: number
): boolean {
  return (
    typeof epochMillis === "number" &&
    epochMillis >= startTime &&
    epochMillis < endTime
  );
}

export function countByTimestamp(
  moves: Doc<"moves">[],
  timestampSelector: (m: Doc<"moves">) => number | null | undefined,
  startTime: number,
  endTime: number
): number {
  let count = 0;
  for (const moveRecord of moves) {
    const timestamp = timestampSelector(moveRecord);
    if (isWithinRange(timestamp, startTime, endTime)) count++;
  }
  return count;
}

export function buildStatusTimestampPatch(
  currentMove: Doc<"moves">,
  newStatus: MoveStatus,
  effectiveAtMs: number
): Partial<Doc<"moves">> {
  const patch: Partial<Doc<"moves">> = {};

  switch (newStatus) {
    case "Quoted":
      if (currentMove.quotedAt == null) patch.quotedAt = effectiveAtMs;
      break;

    case "Booked":
      if (currentMove.bookedAt == null) patch.bookedAt = effectiveAtMs;
      break;

    case "Completed":
      if (currentMove.completedAt == null) {
        patch.completedAt = currentMove.actualEndTime ?? effectiveAtMs;
      }
      break;

    case "Cancelled":
      if (currentMove.cancelledAt == null) patch.cancelledAt = effectiveAtMs;
      break;

    case "Lost":
      if (currentMove.lostAt == null) patch.lostAt = effectiveAtMs;
      break;

    case "New Lead":
    default:
      break;
  }

  return patch;
}
