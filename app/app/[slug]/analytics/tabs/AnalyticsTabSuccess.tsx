import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import Forecasted from "./Forecasted";
import Historical from "./Historical";
import { Option } from "@/types/types";

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
      referrals
        .filter(
          (referralRecord) =>
            typeof referralRecord.name === "string" &&
            referralRecord.name.trim().length > 0
        )
        .map((referralRecord) => {
          const name = referralRecord.name!.trim();
          return { value: name, label: name };
        }),
    [referrals]
  );

  return tab === "FORECASTED" ? (
    <Forecasted userOptions={userOptions} sourceOptions={sourceOptions} />
  ) : (
    <Historical userOptions={userOptions} sourceOptions={sourceOptions} />
  );
}

export default AnalyticsTabSuccess;
