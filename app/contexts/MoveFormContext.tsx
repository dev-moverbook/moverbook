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
import { getHourlyRateFromLabor } from "../frontendUtils/helper";
import { useDistanceMatrix } from "../app/[slug]/add-move/hooks/useDistanceMatrix";
import { buildDefaultSegments } from "../frontendUtils/segmentDistanceHelper";
import {
  buildDefaultMoveFormData,
  buildDefaultCustomer,
} from "../frontendUtils/moveFormHelper/defaults";
import { createMoveFormActions } from "../frontendUtils/moveFormHelper/moveFormActions";
import { buildSalesRepOptions } from "../frontendUtils/moveFormHelper/moveFormOptions";
import { applyTravelFeeDefaults } from "../frontendUtils/moveFormHelper/moveFormTravel";
import {
  isInfoSectionComplete as selectInfoDone,
  isLocationComplete as selectLocationDone,
  isLocationSectionComplete as selectLocationsDone,
  isMoveDetailsComplete as selectDetailsDone,
} from "../frontendUtils/moveFormHelper/moveFormSelectors";
import { followLaborRateForTravel } from "../frontendUtils/moveFormHelper/rate";
import { ensureArrivalDefaults } from "../frontendUtils/moveFormHelper/arrival";
import { applyBootstrapDefaults } from "../frontendUtils/moveFormHelper/bootstrap";
import { useSegmentDistances } from "../frontendUtils/moveFormHelper/useSegmentDistances";
import { useCreditCardFee } from "../frontendUtils/moveFormHelper/hooks/useCreditCardFee";
import { useHourlyRate } from "../frontendUtils/moveFormHelper/hooks/useHourlyRate";
import { useDefaultInsurancePolicy } from "../frontendUtils/moveFormHelper/hooks/useDefaultInsurancePolicy";

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

  const [customer, setCustomer] = useState<CustomerFormData>(
    buildDefaultCustomer()
  );
  const [customerErrors, setCustomerErrors] = useState<CustomerFormErrors>({});
  const [segmentDistances, setSegmentDistances] = useState<SegmentDistance[]>(
    buildDefaultSegments()
  );
  const [moveFormData, setMoveFormData] = useState<MoveFormData>(
    buildDefaultMoveFormData()
  );
  const [moveFormErrors, setMoveFormErrors] = useState<MoveFormErrors>({});

  const { fetchDistance } = useDistanceMatrix();

  const {
    addStopLocation,
    updateLocation,
    removeLocation,
    addMoveFee,
    updateMoveFee,
    deleteMoveFee,
    addMoveItem,
    updateMoveItem,
    removeMoveItem,
  } = createMoveFormActions(setMoveFormData);

  useSegmentDistances(
    companyContact?.address,
    moveFormData.locations,
    fetchDistance,
    setSegmentDistances
  );

  useCreditCardFee(creditCardFee, setMoveFormData);

  useHourlyRate(
    laborRates,
    moveFormData.movers,
    moveFormData.jobType,
    setMoveFormData,
    (movers) => getHourlyRateFromLabor(movers, laborRates)
  );

  useDefaultInsurancePolicy(insurancePolicyOptions, setMoveFormData);

  useEffect(() => {
    setMoveFormData((prev) =>
      ensureArrivalDefaults(prev, arrivalWindowOptions)
    );
  }, [
    arrivalWindowOptions,
    moveFormData.arrivalTimes.arrivalWindowStarts,
    moveFormData.arrivalTimes.arrivalWindowEnds,
  ]);

  useEffect(() => {
    setMoveFormData((prev) =>
      applyBootstrapDefaults(prev, {
        companyId,
        deposit: policy?.deposit,
        salesRepId: currentUser?.user._id,
      })
    );
  }, [companyId, policy?.deposit, currentUser?.user._id]);

  useEffect(() => {
    setMoveFormData((prev) => applyTravelFeeDefaults(prev, travelFeeOptions));
  }, [
    travelFeeOptions,
    moveFormData.jobType,
    moveFormData.jobTypeRate,
    moveFormData.travelFeeMethod,
  ]);

  useEffect(() => {
    setMoveFormData((prev) => followLaborRateForTravel(prev));
  }, [
    moveFormData.jobTypeRate,
    moveFormData.travelFeeMethod,
    moveFormData.jobType,
  ]);

  const salesRepOptions = buildSalesRepOptions(salesReps, currentUser?.user);

  const isInfoSectionComplete = selectInfoDone(customer);
  const isLocationSectionComplete = selectLocationsDone(moveFormData.locations);
  const isMoveDetailsComplete = selectDetailsDone(moveFormData);
  const isAllSectionsComplete =
    isInfoSectionComplete && isLocationSectionComplete && isMoveDetailsComplete;

  const isLocationComplete = (index: number) => {
    const location = moveFormData.locations[index];
    return selectLocationDone(location);
  };

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
        segmentDistances,
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
