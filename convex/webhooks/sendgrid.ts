
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";


export const fulfill = internalAction({
    args: {
      to: v.string(),
      from: v.string(),
      text: v.string(),
      subject: v.string(),
    },
    handler: async (ctx, args) => {


      const match = args.to.match(/reply\+(.*?)@/);
      const moveIdString = match ? match[1] : null;
  
      if (!moveIdString) {
        console.error("Could not find moveId in address:", args.to);
        return;
      }

      const moveId = moveIdString as Id<"moves">;

      const move =  await ctx.runQuery(internal.moves.getMoveByIdInternal, { moveId })
      
      if(!move) {
        console.error("Move not found:", moveId);
        return;
      }
  
      const cleanBody = args.text.trim();
  
      await ctx.runMutation(internal.messages.internalCreateMessage, {
        moveId,
        method: "email",
        status: "received",
        message: cleanBody,
        subject: args.subject, 
        sid: "", 
        sentType: "incoming",
        resolvedMessage: cleanBody,
        companyId: move.companyId,
      });
    },
  });