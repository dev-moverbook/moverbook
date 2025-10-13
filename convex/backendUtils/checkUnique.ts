import { Doc, Id } from "@/convex/_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { CommunicationType } from "@/types/types";

export const checkExistingVariable = async (
  ctx: MutationCtx,
  companyId: Id<"companies">,
  name: string
): Promise<Doc<"variables"> | null> => {
  return await ctx.db
    .query("variables")
    .filter((q) =>
      q.and(q.eq(q.field("companyId"), companyId), q.eq(q.field("name"), name))
    )
    .first();
};

export const checkExistingScript = async (
  ctx: MutationCtx,
  companyId: Id<"companies">,
  title: string,
  type: CommunicationType,
  excludeScriptId?: Id<"scripts">
): Promise<boolean> => {
  let query = ctx.db
    .query("scripts")
    .filter((q) =>
      q.and(
        q.eq(q.field("companyId"), companyId),
        q.eq(q.field("title"), title),
        q.eq(q.field("type"), type)
      )
    );

  if (excludeScriptId) {
    query = query.filter((q) => q.neq(q.field("_id"), excludeScriptId));
  }

  const existingScript = await query.first();
  return !!existingScript;
};
