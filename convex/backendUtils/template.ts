import { formatDateToLong } from "@/app/frontendUtils/helper";
import { MoveSchema } from "@/types/convex-schemas";

export const buildTemplateValues = (
  move: MoveSchema
): Record<string, string> => {
  const customerName = move.name;
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
