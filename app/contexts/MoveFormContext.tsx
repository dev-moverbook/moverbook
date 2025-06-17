"use client";
import {
  JobType,
  MoveStatus,
  MoveTimes,
  PaymentMethod,
  SegmentDistance,
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
  CompanyContactSchema,
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
import { transformInsurancePolicy } from "@/utils/helper";
import { getDistanceAndDuration } from "../frontendUtils/google";
import { useDistanceMatrix } from "../app/[slug]/add-move/hooks/useDistanceMatrix";
import { nanoid } from "nanoid";

interface MoveFormData {
  addMoveFee: (fee: MoveFeeInput) => void;
  addStopLocation: () => void;
  alternatePhoneNumber: string;
  alternatePhoneNumberError: string | null;
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
  insurancePolicy: InsurancePolicySchema | null;
  insurancePolicyOptions?: InsurancePolicySchema[];
  isError: boolean;
  isLoading: boolean;
  itemOptions?: ItemSchema[];
  jobType: JobType;
  jobTypeError: string | null;
  locations: LocationInput[];
  moveDate: string | null;
  moveDateError: string | null;
  moveFeeOptions?: FeeSchema[];
  moveFees: MoveFeeInput[];
  salesRep: Id<"users"> | null;
  salesRepOptions: SelectOption[];
  moveStatus: MoveStatus;
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
  serviceType: ServiceType | null;
  serviceTypeError: string | null;
  setAlternatePhoneNumber: (alternatePhoneNumber: string) => void;
  setAlternatePhoneNumberError: (error: string | null) => void;
  setArrivalWindow: (arrivalWindow: {
    arrivalWindowStarts: string;
    arrivalWindowEnds: string;
  }) => void;
  setArrivalWindowError: (error: string | null) => void;
  setDeposit: (deposit: number) => void;
  setEmail: (email: string) => void;
  setEmailError: (error: string | null) => void;
  setEndingHour: (endingHour: number) => void;
  setInsurancePolicy: (insurancePolicy: InsurancePolicySchema | null) => void;
  setJobType: (jobType: JobType) => void;
  setJobTypeError: (error: string | null) => void;
  setMoveDate: (moveDate: string) => void;
  setMoveDateError: (error: string | null) => void;
  setMoveFees: (value: MoveFeeInput[]) => void;
  setMoveStatus: (moveStatus: MoveStatus) => void;
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
  moveItems: MoveItemInput[];
  addMoveItem: (item: MoveItemInput) => void;
  updateMoveItem: (index: number, updated: Partial<MoveItemInput>) => void;
  removeMoveItem: (index: number) => void;
  isCostSectionComplete: boolean;
  isTruckAndMoverCompleted: boolean;
  isLiabilityCoverageComplete: boolean;
  isDepositComplete: boolean;
  isInternalNotesComplete: boolean;
  isInventorySectionComplete: boolean;
  isInfoSectionComplete: boolean;
  setSalesRep: (salesRep: Id<"users">) => void;
  isLocationSectionComplete: boolean;
  isLocationComplete: (index: number) => boolean;
  jobTypeRate: number | null;
  jobTypeRateError: string | null;
  totalMiles: number | null;
  officeToOrigin: number | null;
  destinationToOrigin: number | null;
  roundTripMiles: number | null;
  roundTripDrive: number | null;
  totalMilesError: string | null;
  setJobTypeRate: (jobTypeRate: number) => void;
  setJobTypeRateError: (error: string | null) => void;
  companyContact?: CompanyContactSchema;
  segmentDistances: SegmentDistance[];
  depositMethod: PaymentMethod;
  setDepositMethod: (depositMethod: PaymentMethod) => void;
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
    salesReps,
    policy,
    referrals: referralOptions,
    rooms: roomOptions,
    travelFee,
    companyContact,
  } = moveOptions ?? {};
  const { fetchDistance } = useDistanceMatrix();

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
  const [deposit, setDeposit] = useState<number>(0);
  const [jobTypeRate, setJobTypeRate] = useState<number | null>(null);
  const [jobTypeRateError, setJobTypeRateError] = useState<string | null>(null);
  const [salesRep, setSalesRep] = useState<Id<"users"> | null>(null);
  const [moveStatus, setMoveStatus] = useState<MoveStatus>("New Lead");
  const [notes, setNotes] = useState<string>("");
  const [moveFees, setMoveFees] = useState<MoveFeeInput[]>([]);
  const [insurancePolicy, setInsurancePolicy] =
    useState<InsurancePolicySchema | null>(null);

  const [totalMiles, setTotalMiles] = useState<number | null>(null);
  const [officeToOrigin, setOfficeToOrigin] = useState<number | null>(null);
  const [destinationToOrigin, setDestinationToOrigin] = useState<number | null>(
    null
  );
  const [roundTripMiles, setRoundTripMiles] = useState<number | null>(null);
  const [roundTripDrive, setRoundTripDrive] = useState<number | null>(null);
  const [totalMilesError, setTotalMilesError] = useState<string | null>(null);

  const [moveWindow, setMoveWindow] = useState<MoveTimes>("morning");
  const [moveItems, setMoveItems] = useState<MoveItemInput[]>([]);
  const [segmentDistances, setSegmentDistances] = useState<
    { label: string; distance: number | null; duration: number | null }[]
  >([]);
  const [depositMethod, setDepositMethod] =
    useState<PaymentMethod>("credit_card");
  const [locations, setLocations] = useState<LocationInput[]>([
    {
      uid: nanoid(),
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
      uid: nanoid(),
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

  const origin = companyContact?.address;
  const startAddress = locations[0]?.address ?? null;
  const endAddress =
    locations.length > 1 ? locations[locations.length - 1]?.address : null;

  useEffect(() => {
    if (policy?.deposit !== undefined) {
      setDeposit(policy.deposit);
    }

    if (currentUser?.user._id) {
      setSalesRep(currentUser.user._id);
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

    const addresses = locations
      .map((l) => l.address)
      .filter(Boolean) as string[];
    if (!origin || addresses.length < 2) return;

    const timeout = setTimeout(async () => {
      const addresses = locations
        .map((l) => l.address)
        .filter(Boolean) as string[];
      if (!origin || addresses.length < 2) return;

      const segments: { from: string; to: string; label: string }[] = [];

      // Office to Origin
      segments.push({
        from: origin,
        to: addresses[0],
        label: "Office to Origin",
      });

      // Origin to Stop 1 (if there's at least one stop)
      if (addresses.length >= 3) {
        segments.push({
          from: addresses[0],
          to: addresses[1],
          label: "Origin to Stop 1",
        });

        // Stop i to Stop i+1
        for (let i = 1; i < addresses.length - 2; i++) {
          segments.push({
            from: addresses[i],
            to: addresses[i + 1],
            label: `Stop ${i} to Stop ${i + 1}`,
          });
        }

        // Last stop to destination
        segments.push({
          from: addresses[addresses.length - 2],
          to: addresses[addresses.length - 1],
          label: `Stop ${addresses.length - 2} to Destination`,
        });
      }

      // No stops, just origin and destination
      if (addresses.length === 2) {
        segments.push({
          from: addresses[0],
          to: addresses[1],
          label: "Origin to Destination",
        });
      }

      // Destination to Office
      segments.push({
        from: addresses[addresses.length - 1],
        to: origin,
        label: "Destination to Office",
      });

      const results = await Promise.all(
        segments.map(({ from, to }) =>
          fetchDistance({ origin: from, destination: to })
        )
      );

      const detailedSegments = segments.map((seg, i) => ({
        label: seg.label,
        distance: results[i].success
          ? (results[i].distanceMiles ?? null)
          : null,
        duration: results[i].success
          ? (results[i].durationMinutes ?? null)
          : null,
      }));

      setSegmentDistances(detailedSegments);

      const totalMiles = detailedSegments.reduce(
        (acc, seg) => acc + (seg.distance ?? 0),
        0
      );
      const totalDuration = detailedSegments.reduce(
        (acc, seg) => acc + (seg.duration ?? 0),
        0
      );

      setRoundTripMiles(Number(totalMiles.toFixed(2)));
      setRoundTripDrive(Number(totalDuration.toFixed(2)));
    }, 500);
  }, [
    policy?.deposit,
    currentUser?.user._id,
    insurancePolicyOptions,
    arrivalWindowOptions,
    origin,
    locations,
  ]);

  const addStopLocation = () => {
    const newStop: LocationInput = {
      uid: nanoid(),
      locationType: "stop",
      address: null,
      moveType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
      stopBehavior: undefined,
    };

    setLocations((prev) => {
      const newLocations = [...prev];
      newLocations.splice(prev.length - 1, 0, newStop); // Insert before ending
      return newLocations;
    });
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
    setMoveItems((prev) => [...prev, item]);
  };

  const updateMoveItem = (index: number, updated: Partial<MoveItemInput>) => {
    setMoveItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updated } : item))
    );
  };

  const removeMoveItem = (index: number) => {
    setMoveItems((prev) => prev.filter((_, i) => i !== index));
  };

  const salesRepOptions =
    salesReps?.map((rep) => ({
      label: rep.name,
      value: rep._id,
    })) ?? [];

  if (
    currentUser &&
    !salesRepOptions.some((opt) => opt.value === currentUser.user._id)
  ) {
    salesRepOptions.push({
      label: currentUser.user.name,
      value: currentUser.user._id,
    });
  }

  const isTruckAndMoverCompleted =
    truckCount > 0 &&
    moversCount > 0 &&
    startingHour > 0 &&
    endingHour > 0 &&
    jobTypeRate !== null &&
    jobTypeRate > 0;

  const isLiabilityCoverageComplete = insurancePolicy != null;
  const isDepositComplete = deposit >= 0;
  const isInternalNotesComplete = !!salesRep && !!moveStatus;

  const isCostSectionComplete =
    isTruckAndMoverCompleted &&
    isLiabilityCoverageComplete &&
    isDepositComplete &&
    isInternalNotesComplete;

  const isInventorySectionComplete = moveItems.length > 0;
  const isInfoSectionComplete =
    !!name.trim() &&
    !!email.trim() &&
    !!phoneNumber.trim() &&
    !!alternatePhoneNumber.trim() &&
    !!serviceType &&
    !!moveDate &&
    !!referralSource?.trim() &&
    !!arrivalWindow?.arrivalWindowStarts &&
    !!arrivalWindow?.arrivalWindowEnds;

  const isLocationComplete = (index: number): boolean => {
    const location = locations[index];
    return (
      !!location?.address &&
      !!location?.squareFootage &&
      !!location?.moveType &&
      !!location?.moveSize &&
      !!location?.accessType
    );
  };

  const isLocationSectionComplete = locations.every((location) => {
    return (
      !!location.address &&
      !!location.squareFootage &&
      !!location.moveType &&
      !!location.moveSize &&
      !!location.accessType
    );
  });

  return (
    <MoveFormContext.Provider
      value={{
        addMoveFee,
        addStopLocation,
        alternatePhoneNumber,
        alternatePhoneNumberError,
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
        salesRep,
        salesRepOptions,
        moveStatus,
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
        setAlternatePhoneNumber,
        setAlternatePhoneNumberError,
        setArrivalWindow,
        setArrivalWindowError,
        setDeposit,
        setEmail,
        setEmailError,
        setEndingHour,
        setInsurancePolicy,
        setJobType,
        setJobTypeError,
        setMoveDate,
        setMoveDateError,
        setMoveFees,
        setMoveStatus,
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
        startingHour,
        truckCount,
        truckCountError,
        updateLocation,
        moveWindow,
        setMoveWindow,
        moveItems,
        addMoveItem,
        updateMoveItem,
        removeMoveItem,
        isCostSectionComplete,
        isTruckAndMoverCompleted,
        isLiabilityCoverageComplete,
        isDepositComplete,
        isInternalNotesComplete,
        isInventorySectionComplete,
        isInfoSectionComplete,
        isLocationSectionComplete,
        isLocationComplete,
        jobTypeRate,
        jobTypeRateError,
        setSalesRep,
        updateMoveFee,
        totalMiles,
        officeToOrigin,
        destinationToOrigin,
        roundTripMiles,
        roundTripDrive,
        totalMilesError,
        setJobTypeRate,
        setJobTypeRateError,
        companyContact,
        segmentDistances,
        depositMethod,
        setDepositMethod,
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
