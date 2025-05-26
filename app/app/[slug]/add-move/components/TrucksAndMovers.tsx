import CounterInput from "@/app/components/shared/labeled/CounterInput";
import React from "react";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { JobType } from "@/types/types";
import ToggleButtonGroup from "@/app/components/shared/labeled/ToggleButtonGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import Header4 from "@/app/components/shared/heading/Header4";
const TrucksAndMovers = () => {
  const {
    truckCount,
    setTruckCount,
    moversCount,
    setMoversCount,
    startingHour,
    setStartingHour,
    endingHour,
    setEndingHour,
    jobType,
    setJobType,
    hourlyRate,
    setHourlyRate,
    flatRate,
    setFlatRate,
    hourlyRateError,
    setHourlyRateError,
    flatRateError,
    setFlatRateError,
  } = useMoveForm();
  return (
    <SectionContainer>
      <Header4>Trucks and Movers</Header4>
      <CounterInput
        label="Trucks"
        value={truckCount}
        onChange={setTruckCount}
        min={1}
        max={10}
      />
      <CounterInput
        label="Movers"
        value={moversCount}
        onChange={setMoversCount}
        min={1}
        max={10}
      />
      <div className=" gap-10">
        <Label className="text-white text-sm font-medium mb-2">
          Estimated Time Range
        </Label>
        <div className="flex gap-4">
          <CounterInput
            label="Starting Hour"
            value={startingHour}
            onChange={setStartingHour}
            min={1}
            max={10}
          />
          <CounterInput
            label="Ending Hour"
            value={endingHour}
            onChange={setEndingHour}
            min={1}
            max={10}
          />
        </div>
      </div>
      <ToggleButtonGroup<JobType>
        label="Job Type"
        value={jobType}
        onChange={setJobType}
        options={[
          { label: "Hourly", value: "hourly" },
          { label: "Flat", value: "flat" },
        ]}
      />
      {jobType === "hourly" && (
        <LabeledInput
          label="Hourly Rate ($/hr)"
          value={hourlyRate.toString()}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          error={hourlyRateError}
          type="number"
        />
      )}
      {jobType === "flat" && (
        <LabeledInput
          label="Flat Rate ($)"
          value={flatRate.toString()}
          onChange={(e) => setFlatRate(Number(e.target.value))}
          error={flatRateError}
          type="number"
        />
      )}
    </SectionContainer>
  );
};

export default TrucksAndMovers;
