"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { ServiceType } from "@/types/types";
import { isValidEmail } from "@/frontendUtils/helper";
import { isValidPhoneNumber } from "@/utils/helper";

interface PublicNewMoveFormData {
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string;
  serviceType: ServiceType;
}

interface PublicNewMoveFormContextType {
  publicNewMoveFormData: PublicNewMoveFormData;
  setPublicNewMoveFormData: Dispatch<SetStateAction<PublicNewMoveFormData>>;
  isMoveSubmitted: boolean;
  setIsMoveSubmitted: Dispatch<SetStateAction<boolean>>;
  isSubmitDisabled: boolean;
  isNextDisabled: boolean;
}

const PublicNewMoveFormContext = createContext<
  PublicNewMoveFormContextType | undefined
>(undefined);

export const PublicNewMoveFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isMoveSubmitted, setIsMoveSubmitted] = useState<boolean>(false);
  const [publicNewMoveFormData, setPublicNewMoveFormData] =
    useState<PublicNewMoveFormData>({
      name: "",
      email: "",
      phoneNumber: "",
      altPhoneNumber: "",
      serviceType: "moving",
    });

  const isSubmitDisabled = useMemo(() => {
    return (
      !publicNewMoveFormData.name ||
      !isValidEmail(publicNewMoveFormData.email) ||
      !isValidPhoneNumber(publicNewMoveFormData.phoneNumber) ||
      !publicNewMoveFormData.serviceType
    );
  }, [publicNewMoveFormData]);

  const isNextDisabled = useMemo(() => {
    return (
      !publicNewMoveFormData.name ||
      !isValidEmail(publicNewMoveFormData.email) ||
      !isValidPhoneNumber(publicNewMoveFormData.phoneNumber)
    );
  }, [publicNewMoveFormData]);

  const value: PublicNewMoveFormContextType = {
    publicNewMoveFormData,
    setPublicNewMoveFormData,
    isMoveSubmitted,
    setIsMoveSubmitted,
      isSubmitDisabled,
    isNextDisabled,
    };

  return (
    <PublicNewMoveFormContext.Provider value={value}>
      {children}
    </PublicNewMoveFormContext.Provider>
  );
};

export const usePublicNewMoveForm = (): PublicNewMoveFormContextType => {
  const context = useContext(PublicNewMoveFormContext);
  if (!context) {
    throw new Error(
      "usePublicNewMoveForm must be used within PublicNewMoveFormProvider"
    );
  }
  return context;
};
