import { MutationCtx } from "@/convex/_generated/server";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import { InsurancePolicyInput } from "@/types/form-types";

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const isValidPhoneNumber = (phone: string | null | undefined) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, ""); // remove all non-digit characters
  return digits.length === 10;
};

export const getBaseUrl = (): string => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    return appUrl;
  }

  // Use window.location on the client side as a fallback
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Default to localhost for server-side development
  return "https://www.moverbook.com";
};

export const generateUniqueSlug = async (
  ctx: MutationCtx,
  name: string
): Promise<string> => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!existing) break;

    slug = `${baseSlug}-${suffix++}`;
  }

  return slug;
};

// utils/itemHelpers.ts or similar path
export const calculateWeightFromSize = (size: number | null): number | null => {
  if (size === null || isNaN(size)) return null;
  return size * 7;
};

export const transformInsurancePolicy = (
  policy: InsurancePolicySchema
): InsurancePolicyInput => ({
  name: policy.name,
  coverageAmount: policy.coverageAmount,
  coverageType: policy.coverageType,
  premium: policy.premium,
});
