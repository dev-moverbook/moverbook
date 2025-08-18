"use client";
import { SegmentDistance, SelectOption } from "@/types/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useMoveOptions } from "../hooks/queries/useMoveOptions";
import {
  CustomerFormData,
  CustomerFormErrors,
  LocationInput,
  MoveFeeInput,
  MoveFormData,
  MoveFormErrors,
  MoveItemInput,
} from "@/types/form-types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "../hooks/queries/useCurrentUser";
import { useSlugContext } from "./SlugContext";
import { nanoid } from "nanoid";
import { getHourlyRateFromLabor } from "../frontendUtils/helper";
import { TravelChargingTypes } from "@/types/enums";

interface AddMoveFormData {
  addMoveFee: (fee: MoveFeeInput) => void;
  addStopLocation: () => void;
  arrivalWindowOptions?: Doc<"arrivalWindow">;
  categoryOptions?: Doc<"categories">[];
  companyId: Id<"companies"> | null;
  deleteMoveFee: (index: number) => void;
  errorMessage: string | null;
  insurancePolicyOptions?: Doc<"insurancePolicies">[];
  isError: boolean;
  isLoading: boolean;
  itemOptions?: Doc<"items">[];
  moveFeeOptions?: Doc<"fees">[];
  salesRepOptions: SelectOption[];
  referralOptions?: Doc<"referrals">[];
  removeLocation: (index: number) => void;
  roomOptions?: Doc<"rooms">[];
  updateLocation: (index: number, updated: Partial<LocationInput>) => void;
  updateMoveFee: (index: number, updated: Partial<MoveFeeInput>) => void;
  addMoveItem: (item: MoveItemInput) => void;
  updateMoveItem: (index: number, updated: Partial<MoveItemInput>) => void;
  removeMoveItem: (index: number) => void;
  isInfoSectionComplete: boolean;
  isLocationSectionComplete: boolean;
  isLocationComplete: (index: number) => boolean;
  isMoveDetailsComplete: boolean;
  companyContact?: Doc<"companyContact">;
  customer: CustomerFormData;
  setCustomer: (customer: CustomerFormData) => void;
  customerErrors: CustomerFormErrors;
  setCustomerErrors: (errors: CustomerFormErrors) => void;
  moveFormData: MoveFormData;
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>;
  moveFormErrors: MoveFormErrors;
  setMoveFormErrors: (errors: MoveFormErrors) => void;
  segmentDistances: SegmentDistance[];
  travelFeeOptions?: Doc<"travelFee">;
  isAllSectionsComplete: boolean;
}
const MoveFormContext = createContext<AddMoveFormData | undefined>(undefined);

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
    laborRates,
    salesReps,
    policy,
    referrals: referralOptions,
    rooms: roomOptions,
    travelFee: travelFeeOptions,
    companyContact,
  } = moveOptions ?? {};

  const [customer, setCustomer] = useState<CustomerFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    altPhoneNumber: "",
    referral: "",
  });

  const [customerErrors, setCustomerErrors] = useState<CustomerFormErrors>({});

  const [moveFormData, setMoveFormData] = useState<MoveFormData>({
    arrivalTimes: {
      arrivalWindowEnds: "",
      arrivalWindowStarts: "",
    },
    companyId: null,
    creditCardFee: 0,
    deposit: 0,
    paymentMethod: { kind: "credit_card" },
    destinationToOrigin: null,
    endingMoveTime: 1,
    liabilityCoverage: null,
    jobType: "hourly",
    jobTypeRate: null,
    locations: [
      {
        uid: nanoid(),
        locationRole: "starting",
        address: null,
        locationType: null,
        aptNumber: null,
        aptName: null,
        squareFootage: null,
        accessType: null,
        moveSize: null,
        timeDistanceRange: "0-30 sec (less than 100 ft)",
      },
      {
        uid: nanoid(),
        locationRole: "ending",
        address: null,
        locationType: null,
        aptNumber: null,
        aptName: null,
        squareFootage: null,
        accessType: null,
        moveSize: null,
        timeDistanceRange: "0-30 sec (less than 100 ft)",
      },
    ],
    moveCustomerId: null,
    moveDate: null,
    moveFees: [],
    moveItems: [],
    moveStatus: "New Lead",
    moveWindow: "morning",
    movers: 1,
    notes: "",
    officeToOrigin: null,
    roundTripDrive: null,
    roundTripMiles: null,
    salesRep: null,
    serviceType: null,
    startingMoveTime: 1,
    totalMiles: null,
    trucks: 1,
  });

  const [moveFormErrors, setMoveFormErrors] = useState<MoveFormErrors>({});

  const origin = companyContact?.address;

  useEffect(() => {
    if (creditCardFee) {
      setMoveFormData((prev) => ({
        ...prev,
        creditCardFee: creditCardFee.rate,
      }));
    }
  }, [creditCardFee]);

  useEffect(() => {
    if (!laborRates || moveFormData.jobType !== "hourly") return;

    const calculatedRate = getHourlyRateFromLabor(
      moveFormData.movers,
      laborRates
    );

    if (
      calculatedRate !== null &&
      moveFormData.jobTypeRate !== calculatedRate
    ) {
      setMoveFormData((prev) => ({
        ...prev,
        jobTypeRate: calculatedRate,
      }));
    }
  }, [
    moveFormData.movers,
    moveFormData.jobType,
    laborRates,
    moveFormData.jobTypeRate,
  ]);

  useEffect(() => {
    if (companyId) {
      setMoveFormData((prev) => ({ ...prev, companyId }));
    }

    if (policy?.deposit !== undefined) {
      setMoveFormData((prev) => ({ ...prev, deposit: policy.deposit }));
    }

    if (currentUser?.user._id) {
      setMoveFormData((prev) => ({ ...prev, salesRep: currentUser.user._id }));
    }

    if (insurancePolicyOptions) {
      const defaultPolicy = insurancePolicyOptions.find((p) => p.isDefault);
      setMoveFormData((prev) => ({
        ...prev,
        liabilityCoverage: defaultPolicy ?? insurancePolicyOptions[0],
      }));
    }

    if (
      arrivalWindowOptions &&
      moveFormData.arrivalTimes.arrivalWindowStarts === "" &&
      moveFormData.arrivalTimes.arrivalWindowEnds === ""
    ) {
      setMoveFormData((prev) => ({
        ...prev,
        arrivalTimes: {
          arrivalWindowStarts: arrivalWindowOptions.morningArrival,
          arrivalWindowEnds: arrivalWindowOptions.morningEnd,
        },
        moveWindow: "morning",
      }));
    }

    const addresses = moveFormData.locations
      .map((l) => l.address)
      .filter(Boolean) as string[];

    if (!origin || addresses.length < 2) return;
  }, [
    policy?.deposit,
    currentUser?.user._id,
    insurancePolicyOptions,
    arrivalWindowOptions,
    origin,
    moveFormData.locations,
    moveFormData.arrivalTimes.arrivalWindowStarts,
    moveFormData.arrivalTimes.arrivalWindowEnds,
    moveFormData.moveWindow,
    moveFormData.jobType,
    moveFormData.jobTypeRate,
    companyId,
  ]);

  useEffect(() => {
    if (
      moveFormData.serviceType === "packing" ||
      moveFormData.serviceType === "load_only" ||
      moveFormData.serviceType === "unload_only"
    ) {
      setMoveFormData((prev) => ({ ...prev, trucks: 0 }));
    }
  }, [moveFormData.serviceType]);

  useEffect(() => {
    if (moveFormData.travelFeeMethod !== null) return;

    if (travelFeeOptions?.defaultMethod === TravelChargingTypes.FLAT) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: travelFeeOptions.defaultMethod,
        travelFeeRate: travelFeeOptions.flatRate ?? null,
      }));
    } else if (
      travelFeeOptions?.defaultMethod === TravelChargingTypes.LABOR_HOURS &&
      moveFormData.jobType === "hourly"
    ) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: travelFeeOptions.defaultMethod,
        travelFeeRate: moveFormData.jobTypeRate ?? null,
      }));
    } else if (
      travelFeeOptions?.defaultMethod === TravelChargingTypes.MILEAGE
    ) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: travelFeeOptions.defaultMethod,
        travelFeeRate: travelFeeOptions.mileageRate ?? null,
      }));
    }
  }, [
    travelFeeOptions,
    moveFormData.jobType,
    moveFormData.jobTypeRate,
    moveFormData.travelFeeMethod,
  ]);

  const { jobTypeRate, travelFeeMethod, jobType } = moveFormData;

  useEffect(() => {
    if (
      travelFeeMethod === TravelChargingTypes.LABOR_HOURS &&
      jobType === "hourly"
    ) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeRate: jobTypeRate ?? null,
      }));
    }
  }, [jobTypeRate, travelFeeMethod, jobType]);

  const addStopLocation = () => {
    const newStop: LocationInput = {
      uid: nanoid(),
      locationRole: "stop",
      address: null,
      locationType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
      timeDistanceRange: "0-30 sec (less than 100 ft)",
    };

    setMoveFormData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations.slice(0, -1),
        newStop,
        prev.locations[prev.locations.length - 1],
      ],
    }));
  };

  // inside MoveFormProvider

  const updateLocation = (index: number, updated: Partial<LocationInput>) => {
    // strip undefined so we don't overwrite existing fields
    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([, v]) => v !== undefined)
    ) as Partial<LocationInput>;

    setMoveFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? { ...loc, ...cleaned } : loc
      ),
    }));
  };

  const removeLocation = (index: number) => {
    setMoveFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const addMoveFee = (fee: MoveFeeInput) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveFees: [...prev.moveFees, fee],
    }));
  };
  const updateMoveFee = (index: number, updated: Partial<MoveFeeInput>) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveFees: prev.moveFees.map((fee, i) =>
        i === index ? { ...fee, ...updated } : fee
      ),
    }));
  };

  const deleteMoveFee = (index: number) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveFees: prev.moveFees.filter((_, i) => i !== index),
    }));
  };

  const addMoveItem = (item: MoveItemInput) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveItems: [...prev.moveItems, item],
    }));
  };
  const updateMoveItem = (index: number, updated: Partial<MoveItemInput>) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveItems: prev.moveItems.map((item, i) =>
        i === index ? { ...item, ...updated } : item
      ),
    }));
  };
  const removeMoveItem = (index: number) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveItems: prev.moveItems.filter((_, i) => i !== index),
    }));
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

  const isInfoSectionComplete =
    !!customer.email.trim() &&
    !!customer.phoneNumber.trim() &&
    (customer.altPhoneNumber ? !!customer.altPhoneNumber.trim() : true) &&
    !!customer.referral;
  const isLocationComplete = (index: number): boolean => {
    const location = moveFormData.locations[index];
    return (
      !!location?.address &&
      !!location?.locationType &&
      !!location?.accessType &&
      !!location?.timeDistanceRange &&
      !!location?.locationRole &&
      location?.squareFootage !== null &&
      location?.squareFootage !== undefined &&
      (location?.locationRole === "ending" ||
        (location?.moveSize !== null && location?.moveSize !== undefined))
    );
  };

  const isLocationSectionComplete = moveFormData.locations.every(
    (location: LocationInput) => {
      return (
        !!location?.address &&
        !!location?.locationType &&
        !!location?.accessType &&
        !!location?.timeDistanceRange &&
        !!location?.locationRole &&
        location?.squareFootage !== null &&
        location?.squareFootage !== undefined &&
        (location?.locationRole === "ending" ||
          (location?.moveSize !== null && location?.moveSize !== undefined))
      );
    }
  );

  const isMoveDetailsComplete =
    moveFormData.serviceType !== null &&
    moveFormData.moveWindow !== null &&
    !!moveFormData.moveDate &&
    !!moveFormData.arrivalTimes.arrivalWindowStarts &&
    !!moveFormData.arrivalTimes.arrivalWindowEnds;

  const isAllSectionsComplete =
    isInfoSectionComplete && isLocationSectionComplete && isMoveDetailsComplete;

  return (
    <MoveFormContext.Provider
      value={{
        addMoveFee,
        addStopLocation,
        arrivalWindowOptions,
        categoryOptions,
        companyId,
        deleteMoveFee,
        errorMessage,
        insurancePolicyOptions,
        isError,
        isLoading,
        itemOptions,
        moveFeeOptions,
        salesRepOptions,
        referralOptions,
        removeLocation,
        roomOptions,
        updateLocation,
        addMoveItem,
        updateMoveItem,
        removeMoveItem,
        isAllSectionsComplete,
        isInfoSectionComplete,
        isLocationSectionComplete,
        isLocationComplete,
        isMoveDetailsComplete,
        updateMoveFee,
        companyContact,
        customer,
        setCustomer,
        segmentDistances: [],
        customerErrors,
        setCustomerErrors,
        moveFormData,
        setMoveFormData,
        moveFormErrors,
        setMoveFormErrors,
        travelFeeOptions,
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
