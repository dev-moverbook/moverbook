"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { sendSendGridEmail } from "../backendUtils/sendGrid";
import { extractEmail, getMoveRelayAddress } from "../backendUtils/email";


export const fulfill = internalAction({
  args: {
    to: v.string(),
    from: v.string(),
    text: v.string(),
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanFrom = extractEmail(args.from);
    const match = args.to.match(/reply\+(.*?)@/);
    const moveIdString = match ? match[1] : null;

    if (!moveIdString) {
      console.error("Could not find moveId in address:", args.to);
      return;
    }

    const moveId = moveIdString as Id<"moves">;

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId,
    });

    if (!move) {
      console.error("Move not found:", moveId);
      return;
    }

    const salesRep = await ctx.runQuery(internal.users.getUserByIdInternal, {
      userId: move.salesRep!,
    });

    if (!salesRep) {
      console.error("Sales rep not found:", move.salesRep);
      return;
    }

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: move.moveCustomerId!,
      }
    );

    if (!moveCustomer) {
      console.error("Move customer not found:", move.moveCustomerId);
      return;
    }

    const customerEmail = moveCustomer.email.toLowerCase().trim();

    const sentType = cleanFrom === customerEmail ? "incoming" : "outgoing";
    const cleanBody = args.text.trim();

    await ctx.runMutation(internal.messages.internalCreateMessage, {
      moveId,
      method: "email",
      status: "received",
      message: cleanBody,
      subject: args.subject,
      sid: "",
      sentType,
      resolvedMessage: cleanBody,
      companyId: move.companyId,
    });

    const relayAddress = getMoveRelayAddress(moveId);

    if (sentType === "incoming") {
      await sendSendGridEmail({
        toEmail: salesRep.email,
        bodyText: `Customer ${moveCustomer.name} said: \n\n ${args.text} \n\n --- Reply directly to this email to message the customer back.`,
        bodyHtml: args.text,
        subject: args.subject,
        replyToEmail: relayAddress,
        replyToName: moveCustomer.name,
      });
    } else {
      await sendSendGridEmail({
        toEmail: moveCustomer.email,
        bodyText: args.text,
        subject: args.subject,
        replyToEmail: relayAddress,
        replyToName: salesRep.name,
      });
    }
  },
});