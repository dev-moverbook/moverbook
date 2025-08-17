import { formatDateToLong } from "@/app/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";

export const buildTemplateValues = (
  move: Doc<"move">,
  customerName: string
): Record<string, string> => {
  const moveDate = move.moveDate;
  formatDateToLong(move.moveDate);

  return {
    customer_name: customerName,
    move_date: moveDate ?? "TBD",
  };
};
export const injectTemplateValues = (
  template: string,
  values: Record<string, string>
) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || "");
};
