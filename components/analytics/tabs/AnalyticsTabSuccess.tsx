import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import Forecasted from "./Forecasted";
import Historical from "./Historical";
import { Option } from "@/types/types";
import ForecastedByReps from "./sections/ForecastedByReps";
import ForecastedBySource from "./sections/ForecastedBySource";
import HistoricalByReps from "./sections/HistoricalByReps";
import HistoricalBySource from "./sections/HistoricalBySource";

function AnalyticsTabSuccess({
  tab,
  users,
  referrals,
}: {
  tab: "FORECASTED" | "HISTORICAL";
  users: Doc<"users">[];
  referrals: Doc<"referrals">[];
}) {
  const userOptions: Option[] = React.useMemo(
    () =>
      users.map((userRecord) => ({
        value: String(userRecord._id),
        label: userRecord.name ?? userRecord.email,
        image: userRecord.imageUrl,
      })),
    [users]
  );

  const sourceOptions: Option[] = React.useMemo(
    () =>
      referrals.map((referralRecord) => {
        const name = referralRecord.name!.trim();
        return { value: referralRecord._id, label: name };
      }),
    [referrals]
  );

  return tab === "FORECASTED" ? (
    <div className="space-y-3 ">
      <Forecasted userOptions={userOptions} sourceOptions={sourceOptions} />
      <ForecastedByReps />
      <ForecastedBySource />
    </div>
  ) : (
    <div className="space-y-3 ">
      <Historical userOptions={userOptions} sourceOptions={sourceOptions} />
      <HistoricalByReps />
      <HistoricalBySource />
    </div>
  );
}

export default AnalyticsTabSuccess;
