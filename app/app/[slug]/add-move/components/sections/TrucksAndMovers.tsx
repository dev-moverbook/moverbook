import CounterInput from "@/app/components/shared/labeled/CounterInput";
import React from "react";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { JobType } from "@/types/types";
import ToggleButtonGroup from "@/app/components/shared/labeled/ToggleButtonGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import Header3 from "@/app/components/shared/heading/Header3";

// const TrucksAndMovers = () => {
//   const {
//     truckCount,
//     setTruckCount,
//     moversCount,
//     setMoversCount,
//     startingHour,
//     setStartingHour,
//     endingHour,
//     setEndingHour,
//     jobType,
//     setJobType,
//     isTruckAndMoverCompleted,
//     setJobTypeRate,
//     setJobTypeRateError,
//     jobTypeRate,
//     jobTypeRateError,
//   } = useMoveForm();

//   return (
//     <SectionContainer>
//       <Header3 isCompleted={isTruckAndMoverCompleted}>
//         Trucks and Movers
//       </Header3>
//       <div className="grid grid-cols-2 ">
//         <CounterInput
//           label="Trucks"
//           value={truckCount}
//           onChange={setTruckCount}
//           min={1}
//           max={10}
//         />
//         <CounterInput
//           label="Movers"
//           value={moversCount}
//           onChange={setMoversCount}
//           min={1}
//           max={10}
//         />
//       </div>
//       <div className="grid grid-cols-2 mt-4">
//         <CounterInput
//           label="Estimated Starting Hour"
//           value={startingHour}
//           onChange={setStartingHour}
//           min={1}
//           max={10}
//         />
//         <CounterInput
//           label="Estimated Ending Hour"
//           value={endingHour}
//           onChange={setEndingHour}
//           min={1}
//           max={10}
//         />
//       </div>

//       <ToggleButtonGroup<JobType>
//         label="Job Type"
//         value={jobType}
//         onChange={setJobType}
//         options={[
//           { label: "Hourly", value: "hourly" },
//           { label: "Flat", value: "flat" },
//         ]}
//       />
//       <LabeledInput
//         label={jobType === "hourly" ? "Hourly Rate ($/hr)" : "Flat Rate ($)"}
//         value={jobTypeRate?.toString() || ""}
//         onChange={(e) => {
//           setJobTypeRate(Math.round(Number(e.target.value) * 100) / 100);
//           setJobTypeRateError(null);
//         }}
//         error={jobTypeRateError}
//         type="number"
//         min={0}
//         step="0.01"
//       />
//     </SectionContainer>
//   );
// };

// export default TrucksAndMovers;

interface TrucksAndMoversProps {
  truckCount: number;
  moversCount: number;
  startingHour: number;
  endingHour: number;
  jobType: JobType;
  jobTypeRate: number | null;
  jobTypeRateError?: string | null;
  isCompleted?: boolean;
  isEditing?: boolean;

  onChange: {
    setTruckCount: (value: number) => void;
    setMoversCount: (value: number) => void;
    setStartingHour: (value: number) => void;
    setEndingHour: (value: number) => void;
    setJobType: (value: JobType) => void;
    setJobTypeRate: (value: number) => void;
    setJobTypeRateError: (error: string | null) => void;
  };
}

const TrucksAndMovers: React.FC<TrucksAndMoversProps> = ({
  truckCount,
  moversCount,
  startingHour,
  endingHour,
  jobType,
  jobTypeRate,
  jobTypeRateError,
  isCompleted,
  isEditing = true,
  onChange,
}) => {
  return (
    <SectionContainer>
      <Header3 wrapperClassName="px-0" isCompleted={isCompleted}>
        Trucks and Movers
      </Header3>

      <div className="grid grid-cols-2">
        <CounterInput
          label="Trucks"
          value={truckCount}
          onChange={onChange.setTruckCount}
          min={1}
          max={10}
          isEditingProp={isEditing}
        />
        <CounterInput
          label="Movers"
          value={moversCount}
          onChange={onChange.setMoversCount}
          min={1}
          max={10}
          isEditingProp={isEditing}
        />
      </div>

      <div className="grid grid-cols-2 mt-4">
        <CounterInput
          label="Estimated Starting Hour"
          value={startingHour}
          onChange={onChange.setStartingHour}
          min={1}
          max={10}
          isEditingProp={isEditing}
        />
        <CounterInput
          label="Estimated Ending Hour"
          value={endingHour}
          onChange={onChange.setEndingHour}
          min={1}
          max={10}
          isEditingProp={isEditing}
        />
      </div>

      <ToggleButtonGroup<JobType>
        label="Job Type"
        value={jobType}
        onChange={onChange.setJobType}
        options={[
          { label: "Hourly", value: "hourly" },
          { label: "Flat", value: "flat" },
        ]}
        isEditing={isEditing}
      />

      <LabeledInput
        label={jobType === "hourly" ? "Hourly Rate ($/hr)" : "Flat Rate ($)"}
        value={jobTypeRate?.toString() || ""}
        onChange={(e) => {
          onChange.setJobTypeRate(
            Math.round(Number(e.target.value) * 100) / 100
          );
          onChange.setJobTypeRateError(null);
        }}
        error={jobTypeRateError}
        type="number"
        min={0}
        step="0.01"
        isEditing={isEditing}
      />
    </SectionContainer>
  );
};

export default TrucksAndMovers;
