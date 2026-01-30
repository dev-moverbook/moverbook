import { Id } from "@/convex/_generated/dataModel";

export function normalizeParam<T extends string = string>(
  raw: string | string[] | undefined
): T | undefined {
  if (typeof raw === "string") {
    return raw as T;
  }
  if (Array.isArray(raw) && raw.length > 0) {
    return raw[0] as T;
  }
  return undefined;
}

export function normalizeUserId(
  raw: string | string[] | undefined
): Id<"users"> | undefined {
  return normalizeParam<Id<"users">>(raw);
}

export function normalizeSlug(
  raw: string | string[] | undefined
): string | undefined {
  return normalizeParam<string>(raw);
}

export function normalizeCustomerId(
  raw: string | string[] | undefined
): Id<"moveCustomers"> | undefined {
  return normalizeParam<Id<"moveCustomers">>(raw);
}

export function normalizeMoveId(
  raw: string | string[] | undefined
): Id<"moves"> | undefined {
  return normalizeParam<Id<"moves">>(raw);
}
