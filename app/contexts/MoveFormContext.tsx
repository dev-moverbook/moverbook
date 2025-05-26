"use client";
import { JobType } from "@/types/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MoveFormData {
  name: string;
  setName: (name: string) => void;
  nameError: string | null;
  setNameError: (error: string | null) => void;
  email: string;
  setEmail: (email: string) => void;
  emailError: string | null;
  setEmailError: (error: string | null) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  phoneNumberError: string | null;
  setPhoneNumberError: (error: string | null) => void;
  alternatePhoneNumber: string;
  setAlternatePhoneNumber: (alternatePhoneNumber: string) => void;
  alternatePhoneNumberError: string | null;
  setAlternatePhoneNumberError: (error: string | null) => void;
  serviceType: "moving" | "packing" | "labor";
  setServiceType: (serviceType: "moving" | "packing" | "labor") => void;
  serviceTypeError: string | null;
  setServiceTypeError: (error: string | null) => void;
  moveDate: string;
  setMoveDate: (moveDate: string) => void;
  moveDateError: string | null;
  setMoveDateError: (error: string | null) => void;
  referralSource: string;
  setReferralSource: (referralSource: string) => void;
  referralSourceError: string | null;
  setReferralSourceError: (error: string | null) => void;
  moveType: string;
  setMoveType: (moveType: string) => void;
  moveTypeError: string | null;
  setMoveTypeError: (error: string | null) => void;
  aptUnitSuite: string;
  setAptUnitSuite: (aptUnitSuite: string) => void;
  aptUnitSuiteError: string | null;
  setAptUnitSuiteError: (error: string | null) => void;
  aptBuildingName: string;
  setAptBuildingName: (aptBuildingName: string) => void;
  aptBuildingNameError: string | null;
  setAptBuildingNameError: (error: string | null) => void;
  squareFootage: string;
  setSquareFootage: (squareFootage: string) => void;
  squareFootageError: string | null;
  setSquareFootageError: (error: string | null) => void;
  access: string;
  setAccess: (access: string) => void;
  accessError: string | null;
  setAccessError: (error: string | null) => void;
  arrivalWindow: {
    arrivalWindowStarts: string;
    arrivalWindowEnds: string;
  };
  setArrivalWindow: (arrivalWindow: {
    arrivalWindowStarts: string;
    arrivalWindowEnds: string;
  }) => void;
  arrivalWindowError: string | null;
  setArrivalWindowError: (error: string | null) => void;
  truckCount: number;
  setTruckCount: (truckCount: number) => void;
  truckCountError: string | null;
  setTruckCountError: (error: string | null) => void;
  moversCount: number;
  setMoversCount: (moversCount: number) => void;
  moversCountError: string | null;
  setMoversCountError: (error: string | null) => void;
  startingHour: number;
  setStartingHour: (startingHour: number) => void;
  endingHour: number;
  setEndingHour: (endingHour: number) => void;
  jobType: JobType;
  setJobType: (jobType: JobType) => void;
  jobTypeError: string | null;
  setJobTypeError: (error: string | null) => void;
  hourlyRate: number;
  setHourlyRate: (hourlyRate: number) => void;
  hourlyRateError: string | null;
  setHourlyRateError: (error: string | null) => void;
  flatRate: number;
  setFlatRate: (flatRate: number) => void;
  flatRateError: string | null;
  setFlatRateError: (error: string | null) => void;
}

const MoveFormContext = createContext<MoveFormData | undefined>(undefined);

export const MoveFormProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState<string>("");
  const [alternatePhoneNumberError, setAlternatePhoneNumberError] = useState<
    string | null
  >(null);
  const [serviceType, setServiceType] = useState<
    "moving" | "packing" | "labor"
  >("moving");
  const [serviceTypeError, setServiceTypeError] = useState<string | null>(null);
  const [moveDate, setMoveDate] = useState<string>("");
  const [moveDateError, setMoveDateError] = useState<string | null>(null);
  const [referralSource, setReferralSource] = useState<string>("");
  const [referralSourceError, setReferralSourceError] = useState<string | null>(
    null
  );
  const [moveType, setMoveType] = useState<string>("");
  const [moveTypeError, setMoveTypeError] = useState<string | null>(null);
  const [aptUnitSuite, setAptUnitSuite] = useState<string>("");
  const [aptUnitSuiteError, setAptUnitSuiteError] = useState<string | null>(
    null
  );
  const [aptBuildingName, setAptBuildingName] = useState<string>("");
  const [aptBuildingNameError, setAptBuildingNameError] = useState<
    string | null
  >(null);
  const [squareFootage, setSquareFootage] = useState<string>("");
  const [squareFootageError, setSquareFootageError] = useState<string | null>(
    null
  );
  const [access, setAccess] = useState<string>("");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [arrivalWindow, setArrivalWindow] = useState<{
    arrivalWindowStarts: string;
    arrivalWindowEnds: string;
  }>({ arrivalWindowStarts: "", arrivalWindowEnds: "" });

  const [arrivalWindowError, setArrivalWindowError] = useState<string | null>(
    null
  );
  const [truckCount, setTruckCount] = useState<number>(1);
  const [truckCountError, setTruckCountError] = useState<string | null>(null);
  const [moversCount, setMoversCount] = useState<number>(1);
  const [moversCountError, setMoversCountError] = useState<string | null>(null);
  const [startingHour, setStartingHour] = useState<number>(1);
  const [endingHour, setEndingHour] = useState<number>(1);
  const [jobType, setJobType] = useState<JobType>("hourly");
  const [jobTypeError, setJobTypeError] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [hourlyRateError, setHourlyRateError] = useState<string | null>(null);
  const [flatRate, setFlatRate] = useState<number>(0);
  const [flatRateError, setFlatRateError] = useState<string | null>(null);

  return (
    <MoveFormContext.Provider
      value={{
        name,
        setName,
        nameError,
        setNameError,
        jobType,
        setJobType,
        jobTypeError,
        setJobTypeError,
        email,
        setEmail,
        emailError,
        setEmailError,
        phoneNumber,
        setPhoneNumber,
        phoneNumberError,
        setPhoneNumberError,
        alternatePhoneNumber,
        setAlternatePhoneNumber,
        alternatePhoneNumberError,
        setAlternatePhoneNumberError,
        serviceType,
        setServiceType,
        serviceTypeError,
        setServiceTypeError,
        moveDate,
        setMoveDate,
        moveDateError,
        setMoveDateError,
        referralSource,
        setReferralSource,
        referralSourceError,
        setReferralSourceError,
        moveType,
        setMoveType,
        moveTypeError,
        setMoveTypeError,
        aptUnitSuite,
        setAptUnitSuite,
        aptUnitSuiteError,
        setAptUnitSuiteError,
        aptBuildingName,
        setAptBuildingName,
        aptBuildingNameError,
        setAptBuildingNameError,
        squareFootage,
        setSquareFootage,
        squareFootageError,
        setSquareFootageError,
        access,
        setAccess,
        accessError,
        setAccessError,
        arrivalWindow,
        setArrivalWindow,
        arrivalWindowError,
        setArrivalWindowError,
        truckCount,
        setTruckCount,
        truckCountError,
        setTruckCountError,
        moversCount,
        setMoversCount,
        moversCountError,
        setMoversCountError,
        startingHour,
        setStartingHour,
        endingHour,
        setEndingHour,
        hourlyRate,
        setHourlyRate,
        flatRate,
        setFlatRate,
        hourlyRateError,
        setHourlyRateError,
        flatRateError,
        setFlatRateError,
      }}
    >
      {children}
    </MoveFormContext.Provider>
  );
};

export const useMoveForm = () => {
  const context = useContext(MoveFormContext);
  if (!context) {
    throw new Error("useMoveForm must be used within MoveFormProvider");
  }
  return context;
};
