import CounterInput from "@/app/components/shared/labeled/CounterInput";
import React from "react";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { JobType } from "@/types/types";
import ToggleButtonGroup from "@/app/components/shared/labeled/ToggleButtonGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import Header3 from "@/app/components/shared/heading/Header3";

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

  const isCompleted =
    (truckCount > 0 &&
      moversCount > 0 &&
      startingHour > 0 &&
      endingHour > 0 &&
      jobType !== null &&
      jobType === "hourly" &&
      hourlyRate > 0) ||
    (jobType === "flat" && flatRate > 0);
  return (
    <SectionContainer>
      <Header3 isCompleted={isCompleted}>Trucks and Movers</Header3>
      <div className="grid grid-cols-2 ">
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
      </div>
      <div className="grid grid-cols-2 mt-4">
        <CounterInput
          label="Estimated Starting Hour"
          value={startingHour}
          onChange={setStartingHour}
          min={1}
          max={10}
        />
        <CounterInput
          label="Estimated Ending Hour"
          value={endingHour}
          onChange={setEndingHour}
          min={1}
          max={10}
        />
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
          onChange={(e) =>
            setHourlyRate(Math.round(Number(e.target.value) * 100) / 100)
          }
          error={hourlyRateError}
          type="number"
          min={0}
          step="0.01"
        />
      )}
      {jobType === "flat" && (
        <LabeledInput
          label="Flat Rate ($)"
          value={flatRate.toString()}
          onChange={(e) =>
            setFlatRate(Math.round(Number(e.target.value) * 100) / 100)
          }
          error={flatRateError}
          type="number"
          min={0}
          step="0.01"
        />
      )}
    </SectionContainer>
  );
};

export default TrucksAndMovers;
