import { Doc } from "@/convex/_generated/dataModel";
import { MutationCtx } from "@/convex/_generated/server";
import { InsurancePolicyInput } from "@/types/form-types";
import parsePhoneNumberFromString from "libphonenumber-js/min";
import isEmail from "validator/lib/isEmail";

export const isValidEmail = (email: string) => {
  return isEmail(email);
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const isValidPhoneNumber = (phone: string | null | undefined) => {
  if (!phone) {
    return false
  }

  const phoneNumber = parsePhoneNumberFromString(phone, "US");

  return phoneNumber?.isValid() ?? false;
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

export const calculateWeightFromSize = (size: number | null): number | null => {
  if (size === null || isNaN(size)) {
    return null;
  }
  return size * 7;
};

export const transformInsurancePolicy = (
  policy: Doc<"insurancePolicies">
): InsurancePolicyInput => ({
  name: policy.name,
  coverageAmount: policy.coverageAmount,
  coverageType: policy.coverageType,
  premium: policy.premium,
});
