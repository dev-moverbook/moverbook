"use client";
import {
  AccessType,
  JobType,
  MoveStatus,
  MoveTimes,
  SelectOption,
  ServiceType,
} from "@/types/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useMoveOptions } from "../hooks/queries/useMoveOptions";
import {
  ArrivalWindowSchema,
  CategorySchema,
  FeeSchema,
  InsurancePolicySchema,
  ItemSchema,
  ReferralSchema,
  RoomSchema,
} from "@/types/convex-schemas";
import {
  InsurancePolicyInput,
  LocationInput,
  MoveFeeInput,
  MoveItemInput,
} from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "../hooks/queries/useCurrentUser";
import { useSlugContext } from "./SlugContext";

interface MoveFormData {
  access: string;
  accessError: string | null;
  addMoveFee: (fee: MoveFeeInput) => void;
  addStopLocation: () => void;
  alternatePhoneNumber: string;
  alternatePhoneNumberError: string | null;
  aptBuildingName: string;
  aptBuildingNameError: string | null;
  aptUnitSuite: string;
  aptUnitSuiteError: string | null;
  arrivalWindow: {
    arrivalWindowStarts: string;
    arrivalWindowEnds: string;
  };
  arrivalWindowError: string | null;
  arrivalWindowOptions?: ArrivalWindowSchema;
  categoryOptions?: CategorySchema[];
  companyId: Id<"companies"> | null;
  deleteMoveFee: (index: number) => void;
  deposit: number;
  email: string;
  emailError: string | null;
  endingHour: number;
  errorMessage: string | null;
  flatRate: number;
  flatRateError: string | null;
  hourlyRate: number;
  hourlyRateError: string | null;
  insurancePolicy: InsurancePolicyInput | null;
  insurancePolicyOptions?: InsurancePolicySchema[];
  isError: boolean;
  isLoading: boolean;
  itemOptions?: ItemSchema[];
  jobType: JobType;
  jobTypeError: string | null;
  locations: LocationInput[];
  moveDate: ServiceType | null;
  moveDateError: string | null;
  moveFeeOptions?: FeeSchema[];
  moveFees: MoveFeeInput[];
  moveRep: Id<"users"> | null;
  moveRepOptions: SelectOption[];
  moveStatus: MoveStatus;
  moveType: ServiceType;
  moveTypeError: string | null;
  name: string;
  nameError: string | null;
  notes: string;
  phoneNumber: string;
  phoneNumberError: string | null;
  referralOptions?: ReferralSchema[];
  referralSource: string | null;
  referralSourceError: string | null;
  removeLocation: (index: number) => void;
  roomOptions?: RoomSchema[];
  serviceType: ServiceType;
  serviceTypeError: string | null;
  setAccess: (access: AccessType) => void;
  setAccessError: (error: string | null) => void;
  setAlternatePhoneNumber: (alternatePhoneNumber: string) => void;
  setAlternatePhoneNumberError: (error: string | null) => void;
  setAptBuildingName: (aptBuildingName: string) => void;
  setAptBuildingNameError: (error: string | null) => void;
  setAptUnitSuite: (aptUnitSuite: string) => void;
  setAptUnitSuiteError: (error: string | null) => void;
  setArrivalWindow: (arrivalWindow: {
    arrivalWindowStarts: string;
    arrivalWindowEnds: string;
  }) => void;
  setArrivalWindowError: (error: string | null) => void;
  setDeposit: (deposit: number) => void;
  setEmail: (email: string) => void;
  setEmailError: (error: string | null) => void;
  setEndingHour: (endingHour: number) => void;
  setFlatRate: (flatRate: number) => void;
  setFlatRateError: (error: string | null) => void;
  setHourlyRate: (hourlyRate: number) => void;
  setHourlyRateError: (error: string | null) => void;
  setInsurancePolicy: (insurancePolicy: InsurancePolicyInput | null) => void;
  setJobType: (jobType: JobType) => void;
  setJobTypeError: (error: string | null) => void;
  setMoveDate: (moveDate: string) => void;
  setMoveDateError: (error: string | null) => void;
  setMoveFees: (value: MoveFeeInput[]) => void;
  setMoveRep: (moveRep: Id<"users">) => void;
  setMoveStatus: (moveStatus: MoveStatus) => void;
  setMoveType: (moveType: ServiceType) => void;
  setMoveTypeError: (error: string | null) => void;
  setName: (name: string) => void;
  setNameError: (error: string | null) => void;
  setNotes: (notes: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPhoneNumberError: (error: string | null) => void;
  setReferralSource: (referralSource: string | null) => void;
  setReferralSourceError: (error: string | null) => void;
  setServiceType: (serviceType: ServiceType) => void;
  setServiceTypeError: (error: string | null) => void;
  setStartingHour: (startingHour: number) => void;
  setTruckCount: (truckCount: number) => void;
  setTruckCountError: (error: string | null) => void;
  setMoversCount: (moversCount: number) => void;
  setMoversCountError: (error: string | null) => void;
  startingHour: number;
  truckCount: number;
  truckCountError: string | null;
  updateLocation: (index: number, updated: Partial<LocationInput>) => void;
  updateMoveFee: (index: number, updated: Partial<MoveFeeInput>) => void;
  moversCount: number;
  moversCountError: string | null;
  moveWindow: MoveTimes;
  setMoveWindow: (moveWindow: MoveTimes) => void;
  addedItems: MoveItemInput[];
  addMoveItem: (item: MoveItemInput) => void;
  updateMoveItem: (index: number, updated: Partial<MoveItemInput>) => void;
  removeMoveItem: (index: number) => void;
}
const MoveFormContext = createContext<MoveFormData | undefined>(undefined);

export const MoveFormProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: moveOptions,
    isLoading,
    isError,
    errorMessage,
  } = useMoveOptions();

  const { data: currentUser } = useCurrentUser();

  const { companyId } = useSlugContext();

  const {
    arrivalWindow: arrivalWindowOptions,
    categories: categoryOptions,
    creditCardFee,
    fees: moveFeeOptions,
    insurancePolicies: insurancePolicyOptions,
    items: itemOptions,
    labor: laborOptions,
    laborRates,
    moveReps,
    policy,
    referrals: referralOptions,
    rooms: roomOptions,
    travelFee,
  } = moveOptions ?? {};

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
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [serviceTypeError, setServiceTypeError] = useState<string | null>(null);
  const [moveDate, setMoveDate] = useState<string>("");
  const [moveDateError, setMoveDateError] = useState<string | null>(null);
  const [referralSource, setReferralSource] = useState<string | null>(null);
  const [referralSourceError, setReferralSourceError] = useState<string | null>(
    null
  );
  const [moveType, setMoveType] = useState<ServiceType | null>(null);
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
  const [access, setAccess] = useState<AccessType>("ground");
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
  const [deposit, setDeposit] = useState<number>(0);
  const [moveRep, setMoveRep] = useState<Id<"users"> | null>(null);
  const [moveStatus, setMoveStatus] = useState<MoveStatus>("New Lead");
  const [notes, setNotes] = useState<string>("");
  const [moveFees, setMoveFees] = useState<MoveFeeInput[]>([]);
  const [insurancePolicy, setInsurancePolicy] =
    useState<InsurancePolicyInput | null>(null);
  const [moveWindow, setMoveWindow] = useState<MoveTimes>("morning");
  const [addedItems, setAddedItems] = useState<MoveItemInput[]>([]);

  useEffect(() => {
    if (policy?.deposit !== undefined) {
      setDeposit(policy.deposit);
    }
    if (currentUser?.user._id) {
      setMoveRep(currentUser.user._id);
    }

    if (insurancePolicyOptions) {
      const defaultPolicy = insurancePolicyOptions.find((p) => p.isDefault);
      setInsurancePolicy(defaultPolicy ?? insurancePolicyOptions[0]);
    }
    if (
      arrivalWindowOptions &&
      arrivalWindow.arrivalWindowStarts === "" &&
      arrivalWindow.arrivalWindowEnds === ""
    ) {
      setArrivalWindow({
        arrivalWindowStarts: arrivalWindowOptions.morningArrival,
        arrivalWindowEnds: arrivalWindowOptions.morningEnd,
      });
      setMoveWindow("morning");
    }
  }, [
    policy?.deposit,
    currentUser?.user._id,
    insurancePolicyOptions,
    arrivalWindowOptions,
  ]);

  const [locations, setLocations] = useState<LocationInput[]>([
    {
      locationType: "starting",
      address: null,
      moveType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
    },
    {
      locationType: "ending",
      address: null,
      moveType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
    },
  ]);

  const addStopLocation = () => {
    setLocations((prev) => [
      ...prev,
      {
        locationType: "stop",
        address: null,
        moveType: null,
        aptNumber: null,
        aptName: null,
        squareFootage: null,
        accessType: null,
        moveSize: null,
      },
    ]);
  };

  const updateLocation = (index: number, updated: Partial<LocationInput>) => {
    setLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, ...updated } : loc))
    );
  };

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const addMoveFee = (fee: MoveFeeInput) => {
    setMoveFees((prev) => [...prev, fee]);
  };

  const updateMoveFee = (index: number, updated: Partial<MoveFeeInput>) => {
    setMoveFees((prev) =>
      prev.map((fee, i) => (i === index ? { ...fee, ...updated } : fee))
    );
  };

  const deleteMoveFee = (index: number) => {
    setMoveFees((prev) => prev.filter((_, i) => i !== index));
  };

  const addMoveItem = (item: MoveItemInput) => {
    setAddedItems((prev) => [...prev, item]);
  };

  const updateMoveItem = (index: number, updated: Partial<MoveItemInput>) => {
    setAddedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updated } : item))
    );
  };

  const removeMoveItem = (index: number) => {
    setAddedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const baseOptions =
    moveReps?.map((rep) => ({
      label: rep.name,
      value: rep._id,
    })) ?? [];

  if (
    currentUser &&
    !baseOptions.some((opt) => opt.value === currentUser.user._id)
  ) {
    baseOptions.push({
      label: currentUser.user.name,
      value: currentUser.user._id,
    });
  }

  return (
    <MoveFormContext.Provider
      value={{
        access,
        accessError,
        addMoveFee,
        addStopLocation,
        alternatePhoneNumber,
        alternatePhoneNumberError,
        aptBuildingName,
        aptBuildingNameError,
        aptUnitSuite,
        aptUnitSuiteError,
        arrivalWindow,
        arrivalWindowError,
        arrivalWindowOptions,
        categoryOptions,
        companyId,
        deleteMoveFee,
        deposit,
        email,
        emailError,
        endingHour,
        errorMessage,
        flatRate,
        flatRateError,
        hourlyRate,
        hourlyRateError,
        insurancePolicy,
        insurancePolicyOptions,
        isError,
        isLoading,
        itemOptions,
        jobType,
        jobTypeError,
        locations,
        moveDate,
        moveDateError,
        moveFeeOptions,
        moveFees,
        moveRep,
        moveRepOptions: baseOptions,
        moveStatus,
        moveType,
        moveTypeError,
        moversCount,
        moversCountError,
        name,
        nameError,
        notes,
        phoneNumber,
        phoneNumberError,
        referralOptions,
        referralSource,
        referralSourceError,
        removeLocation,
        roomOptions,
        serviceType,
        serviceTypeError,
        setAccess,
        setAccessError,
        setAlternatePhoneNumber,
        setAlternatePhoneNumberError,
        setAptBuildingName,
        setAptBuildingNameError,
        setAptUnitSuite,
        setAptUnitSuiteError,
        setArrivalWindow,
        setArrivalWindowError,
        setDeposit,
        setEmail,
        setEmailError,
        setEndingHour,
        setFlatRate,
        setFlatRateError,
        setHourlyRate,
        setHourlyRateError,
        setInsurancePolicy,
        setJobType,
        setJobTypeError,
        setMoveDate,
        setMoveDateError,
        setMoveFees,
        setMoveRep,
        setMoveStatus,
        setMoveType,
        setMoveTypeError,
        setMoversCount,
        setMoversCountError,
        setName,
        setNameError,
        setNotes,
        setPhoneNumber,
        setPhoneNumberError,
        setReferralSource,
        setReferralSourceError,
        setServiceType,
        setServiceTypeError,
        setStartingHour,
        setTruckCount,
        setTruckCountError,
        squareFootage,
        squareFootageError,
        startingHour,
        truckCount,
        truckCountError,
        updateLocation,
        moveWindow,
        setMoveWindow,
        addedItems,
        addMoveItem,
        updateMoveItem,
        removeMoveItem,
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
