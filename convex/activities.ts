// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";
// import {
//   ActivityEventTypeConvex,
//   ActivityEventContextConvex,
//   ActivityEventVisibilityConvex,
//   ActivityIconKeyConvex,
// } from "./schema";

// export const createActivityEvent = mutation({
//   args: {
//     companyId: v.id("companies"),
//     type: ActivityEventTypeConvex,
//     actorUserId: v.optional(v.id("users")),
//     context: ActivityEventContextConvex,
//     visibility: ActivityEventVisibilityConvex,
//   },
//   handler: async (ctx, args) => {
//     const { title, body, iconKey } = renderEvent(
//       args.type as any,
//       args.context
//     );
//     const id = await ctx.db.insert("activities", {
//       companyId: args.companyId,
//       type: args.type,
//       actorUserId: args.actorUserId,
//       context: args.context,
//       visibility: args.visibility,
//       title,
//       body,
//       iconKey,
//     });
//     return id;
//   },
// });

// export const getActivitiesForUser = query({
//   args: {
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     const activities = await ctx.db
//       .query("activities")
//       .withIndex("by_actorUserId", (q) => q.eq("actorUserId", args.userId))
//       .order("desc")
//       .collect();

//     return activities;
//   },
// });

// export const getActivitiesByMoveId = query({
//   args: {
//     moveId: v.id("move"),
//   },
//   handler: async (ctx, args) => {
//     const activities = await ctx.db
//       .query("activities")
//       .withIndex("by_moveId", (q) => q.eq("context.moveId", args.moveId))
//       .order("desc")
//       .collect();

//     return activities;
//   },
// });

// function renderEvent(
//   type: typeof ActivityEventTypeConvex,
//   ctxObj: typeof ActivityEventContextConvex.type
// ): { title: string; body: string; iconKey: typeof ActivityIconKeyConvex.type } {
//   switch (type) {
//     case "CUSTOMER_CREATED":
//       return {
//         title: "New customer created",
//         body: `${ctxObj.customerName ?? "Customer"} created`,
//         iconKey: "bust_silhouette",
//       };
//     case "CUSTOMER_UPDATED":
//       return {
//         title: "Customer updated",
//         body: `${ctxObj.customerName ?? "Customer"} updated`,
//         iconKey: "pencil",
//       };
//     case "MOVE_CREATED":
//       return {
//         title: "Move booked",
//         body: `${ctxObj.customerName ?? "Customer"} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "package",
//       };
//     case "MOVE_UPDATED":
//       return {
//         title: "Move updated",
//         body: `${ctxObj.customerName ?? "Customer"} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "package",
//       };
//     case "MOVE_STATUS_UPDATED":
//       return {
//         title: "Move status updated",
//         body: `${ctxObj.customerName ?? "Customer"} ${ctxObj.moveDate ?? ""} is now ${ctxObj.moveStatus ?? ""}`,
//         iconKey: "arrows_counter_clockwise",
//       };
//     case "ASSIGN_MOVER":
//       return {
//         title: "Mover assigned",
//         body: `${ctxObj.moverId ? "Mover assigned" : "Mover"} • ${ctxObj.customerName ?? ""} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "construction_worker",
//       };
//     case "REMOVE_MOVER":
//       return {
//         title: "Mover removed",
//         body: `${ctxObj.customerName ?? ""} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "x_mark",
//       };
//     case "CUSTOMER_SIGNED_PROPOSAL":
//       return {
//         title: "Proposal signed",
//         body: `${ctxObj.customerName ?? "Customer"} • ${ctxObj.moveDate ?? ""}${ctxObj.amount ? ` • $${ctxObj.amount}` : ""}`,
//         iconKey: "nib",
//       };
//     case "INVOICE_PAYMENT":
//       return {
//         title: "Invoice paid",
//         body: `${ctxObj.customerName ?? "Customer"} • ${ctxObj.moveDate ?? ""}${ctxObj.amount ? ` • $${ctxObj.amount}` : ""}`,
//         iconKey: "dollar",
//       };
//     case "MESSAGE_OUTGOING":
//       return {
//         title: "Message sent",
//         body: `${ctxObj.customerName ?? "Customer"} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "envelope",
//       };
//     case "MESSAGE_INCOMING":
//       return {
//         title: "Message received",
//         body: `${ctxObj.customerName ?? "Customer"} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "envelope",
//       };
//     case "MOVE_STARTED":
//       return {
//         title: "Move started",
//         body: `${ctxObj.customerName ?? ""} • ${ctxObj.timeLabel ?? ""}`,
//         iconKey: "lorry",
//       };
//     case "MOVE_COMPLETED":
//       return {
//         title: "Move completed",
//         body: `${ctxObj.customerName ?? ""} • ${ctxObj.timeLabel ?? ""}`,
//         iconKey: "check",
//       };
//     case "HOURS_UPDATED":
//       return {
//         title: "Hours updated",
//         body: `${ctxObj.approvedPay ? `Approved Pay $${ctxObj.approvedPay}` : "Hours updated"}`,
//         iconKey: "clock_out",
//       };
//     case "FEE_ADDED":
//       return {
//         title: "Fee added",
//         body: `${ctxObj.feeName ?? "Fee"} • ${ctxObj.customerName ?? ""} ${ctxObj.moveDate ?? ""}${ctxObj.amount ? ` • $${ctxObj.amount}` : ""}`,
//         iconKey: "dollar",
//       };
//     case "FEE_UPDATED":
//       return {
//         title: "Fee updated",
//         body: `${ctxObj.feeName ?? "Fee"} • ${ctxObj.customerName ?? ""} ${ctxObj.moveDate ?? ""}${ctxObj.amount ? ` • $${ctxObj.amount}` : ""}`,
//         iconKey: "dollar",
//       };
//     case "FEE_REMOVED":
//       return {
//         title: "Fee removed",
//         body: `${ctxObj.feeName ?? "Fee"} • ${ctxObj.customerName ?? ""} ${ctxObj.moveDate ?? ""}`,
//         iconKey: "dollar",
//       };
//     default:
//       return {
//         title: "Activity",
//         body: "",
//         iconKey: "package",
//       };
//   }
// }
