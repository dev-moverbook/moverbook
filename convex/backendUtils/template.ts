import { formatDateToLong } from "@/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";
import { TEMPLATE_TOKEN_REGEX } from "@/types/const";
import { ActionCtx } from "../_generated/server";
import { clientEnv } from "@/frontendUtils/clientEnv";
import { sendMoveCustomerClerkInvitation } from "../functions/clerk";
import { internal } from "../_generated/api";
import { ClerkRoles } from "@/types/enums";
import { CustomerUser, PublicMoveStep } from "@/types/types";

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

export const buildTemplateValues = async ({
  keys,
  move,
  customerName,
  resolvedValues,
}: {
  keys: Set<string>;
  move: Doc<"moves">;
  customerName: string;
  resolvedValues?: Record<string, string>;
}): Promise<Record<string, string>> => {
  const values: Record<string, string> = {};

  for (const key of keys) {
    switch (key) {
      case "customer_name":
        values.customer_name = customerName;
        break;

      case "move_date":
        values.move_date = move.moveDate
          ? formatDateToLong(move.moveDate)
          : "TBD";
        break;

      default:
        if (resolvedValues?.[key]) {
          values[key] = resolvedValues[key];
        }
        break;
    }
  }

  return values;
};

export const resolveTemplateSideEffects = async ({
  ctx,
  keys,
  move,
  slug,
  moveCustomer,
}: {
  ctx: ActionCtx;
  keys: Set<string>;
  move: Doc<"moves">;
  slug: string;
  moveCustomer: CustomerUser;
}): Promise<Record<string, string>> => {
  const baseUrl = clientEnv().NEXT_PUBLIC_APP_URL;
  const resolved: Record<string, string> = {};

  const hasAccount = Boolean(moveCustomer.clerkUserId);

  const buildMoveLink = async (step?: PublicMoveStep) => {
    if (hasAccount) {
      const url = `${baseUrl}/${slug}/moves/${move._id}`;
      return step ? `${url}?step=${step}` : url;
    }

    const inviteUrl = await ensureMoveCustomerInviteLink({
      ctx,
      move,
      moveCustomer,
    });

    return step ? `${inviteUrl}?step=${step}` : inviteUrl;
  };

  if (keys.has("quote_link")) {
    resolved.quote_link = await buildMoveLink();
  }

  if (keys.has("documents_link")) {
    resolved.documents_link = await buildMoveLink("documents");
  }

  if (keys.has("live_move_link")) {
    resolved.live_move_link = await buildMoveLink("move");
  }

  if (keys.has("payment_link")) {
    resolved.payment_link = await buildMoveLink("payment");
  }

  return resolved;
};

export const ensureMoveCustomerInviteLink = async ({
  ctx,
  move,
  moveCustomer,
}: {
  ctx: ActionCtx;
  move: Doc<"moves">;
  moveCustomer: CustomerUser;
}): Promise<string> => {
  const { invitationId, invitationUrl } = await sendMoveCustomerClerkInvitation(
    moveCustomer.email,
    moveCustomer._id,
    move._id
  );

  await ctx.runMutation(internal.invitations.createInvitationInternal, {
    clerkInvitationId: invitationId,
    moveId: move._id,
    userId: moveCustomer._id,
    role: ClerkRoles.CUSTOMER,
    email: moveCustomer.email,
    hourlyRate: null,
  });

  return invitationUrl;
};
