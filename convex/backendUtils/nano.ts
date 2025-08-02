// lib/generateJobId.ts
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

export const generateJobId = (companyId: string) => {
  const prefix = companyId.slice(0, 2).toUpperCase();
  return `${prefix}-${nanoid()}`;
};
