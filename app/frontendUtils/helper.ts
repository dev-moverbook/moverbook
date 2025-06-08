import { CreatableUserRole } from "@/types/enums";
import { DateTime } from "luxon";

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidRole = (role: string): role is CreatableUserRole => {
  return Object.values(CreatableUserRole).includes(role as CreatableUserRole);
};

export const isValidHourlyRate = (rate: string): boolean => {
  const numericRate = parseFloat(rate);
  return (
    !isNaN(numericRate) && numericRate >= 0 && /^\d+(\.\d{1,2})?$/.test(rate)
  );
};

export const formatMonthDay = (value: number | null | undefined) => {
  if (!value) return "";
  const month = Math.floor(value / 100);
  const day = value % 100;
  return `${month}-${day}`;
};

export const formatTime = (time: string) =>
  DateTime.fromFormat(time, "HH:mm").toFormat("h:mm a");

export const formatDecimalNumber = (
  value: number | null | undefined,
  unit: string
) => {
  if (value == null || isNaN(value)) return "—";
  return `${value.toFixed(2)} ${unit}`;
};
