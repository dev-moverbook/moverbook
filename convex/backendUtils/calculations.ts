export const msPerHour = 1000 * 60 * 60;

export const round2 = (n: number) => Math.round(n * 100) / 100;

export const computeWorkedHours = (args: {
  startTime?: number | null;
  endTime?: number | null;
  breakAmount?: number | null;
}) => {
  const { startTime, endTime, breakAmount } = args;
  if (typeof startTime !== "number" || typeof endTime !== "number") {
    return 0;
  }
  const raw = Math.max(0, (endTime - startTime) / msPerHour);
  const breakHrs = Math.max(0, breakAmount ?? 0);

  return Math.max(0, raw - breakHrs);
};

export const computeApprovedPayout = (args: {
  startTime: number;
  endTime: number;
  breakAmount?: number | null;
  hourlyRate?: number | null;
}) => {
  const hours = round2(
    computeWorkedHours({
      startTime: args.startTime,
      endTime: args.endTime,
      breakAmount: args.breakAmount ?? 0,
    })
  );
  const rate = Math.max(0, args.hourlyRate ?? 0);
  const pay = round2(hours * rate);
  return { hours, pay };
};
