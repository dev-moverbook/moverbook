export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function splitDecimalHours(decimalHours: number): {
  hours: number;
  minutes: number;
} {
  const safeValue = Math.max(0, decimalHours || 0);

  const hoursPart = Math.floor(safeValue);
  const minutesPart = Math.round((safeValue - hoursPart) * 60);

  if (minutesPart === 60) {
    return {
      hours: hoursPart + 1,
      minutes: 0,
    };
  }

  return {
    hours: hoursPart,
    minutes: minutesPart,
  };
}

export function combineToDecimalHours(hours: number, minutes: number): number {
  const safeHours = Math.max(0, hours || 0);
  const safeMinutes = clamp(Math.round(minutes || 0), 0, 59);

  return Number((safeHours + safeMinutes / 60).toFixed(4));
}

export function minutesToHours(minutes: number): number {
  const safeMinutes = Math.max(0, minutes);

  return Number((safeMinutes / 60).toFixed(4));
}

export function hoursToMinutes(hours: number): number {
  const safeHours = hours || 0;

  return Math.max(0, Math.round(safeHours * 60));
}

export const formatDecimalHours = (hours: number, minutes: number) => {
  const decimal = hours + minutes / 60;
  return decimal.toFixed(2) + " hours";
};

export const canPublicEditMove = (moveDate?: string | null) => {
  if (!moveDate) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const moveDay = new Date(moveDate);
  moveDay.setHours(0, 0, 0, 0);

  return moveDay > today;
};
