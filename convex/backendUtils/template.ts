import { formatDateToLong } from "@/frontendUtils/helper";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { TEMPLATE_TOKEN_REGEX, TEMPLATE_VARIABLES } from "@/types/const";
import { ActionCtx } from "../_generated/server";
import { clientEnv } from "@/frontendUtils/clientEnv";
import { internal } from "../_generated/api";
import { PublicMoveStep } from "@/types/types";
import { throwConvexError } from "./errors";

export const injectTemplateValues = (
  template: string,
  values: Record<string, string>
) => {
  return template.replace(TEMPLATE_TOKEN_REGEX, (_, key) => {
    return values[key.trim()] ?? "";
  });
};

export const extractTemplateKeys = (template: string): Set<string> => {
  const matches = template.match(TEMPLATE_TOKEN_REGEX) ?? [];
  return new Set(matches.map((m) => m.slice(2, -2).trim()));
};

export const resolveTemplateSideEffects = async ({
  ctx,
  keys,
  move,
  slug,
  moveCustomer,
  company,
}: {
  ctx: ActionCtx;
  keys: Set<string>;
  move: Doc<"moves">;
  slug: string;
  moveCustomer: Doc<"moveCustomers">;
  company: Doc<"companies">;
}): Promise<Record<string, string>> => {
  const baseUrl = clientEnv().NEXT_PUBLIC_APP_URL;
  const resolved: Record<string, string> = {};


  const buildMoveLink = async (step?: PublicMoveStep) => {
    const url = `${baseUrl}/${slug}/moves/${move._id}`;

    return step ? `${url}?step=${step}` : url;
  };

  const buildInternalReviewLink = async () => {
    const url = `${baseUrl}/${slug}/moves/${move._id}/review`;
    return url;
  };

  if (keys.has(TEMPLATE_VARIABLES.quote_link)) {
    resolved.quote_link = await buildMoveLink();
  }

  if (keys.has(TEMPLATE_VARIABLES.documents_link)) {
    resolved.documents_link = await buildMoveLink("documents");
  }

  if (keys.has(TEMPLATE_VARIABLES.live_move_link)) {
    resolved.live_move_link = await buildMoveLink("move");
  }

  if (keys.has(TEMPLATE_VARIABLES.payment_link)) {
    resolved.payment_link = await buildMoveLink("payment");
  }

  if (keys.has(TEMPLATE_VARIABLES.external_review_link)) {
    resolved.external_review_link = await buildExternalReviewLink({
      ctx,
      companyId: company._id,
    });
  }

  if (keys.has(TEMPLATE_VARIABLES.customer_name)) {
    resolved.customer_name = moveCustomer.name;
  }

  if (keys.has(TEMPLATE_VARIABLES.move_date)) {
    resolved.move_date = move.moveDate
      ? formatDateToLong(move.moveDate)
      : "TBD";
  }

  if (keys.has(TEMPLATE_VARIABLES.internal_review_link)) {
    resolved.internal_review_link = await buildInternalReviewLink();
  }

  return resolved;
};


export const buildExternalReviewLink = async ({
  ctx,
  companyId,
}: {
  ctx: ActionCtx;
  companyId: Id<"companies">;
}): Promise<string> => {
  const webIntegrations = await ctx.runQuery(
    internal.webIntegrations.getWebIntegrationsByCompanyId,
    {
      companyId,
    }
  );

  if (!webIntegrations?.externalReviewUrl) {
    throwConvexError("external review not found", {
      code: "NOT_FOUND",
    });
  }

  return webIntegrations.externalReviewUrl;
};
