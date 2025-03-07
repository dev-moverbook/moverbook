import { CreatableUserRole } from "@/types/enums";

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
