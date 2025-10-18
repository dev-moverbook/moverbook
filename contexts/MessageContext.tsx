"use client";

import { CommunicationType } from "@/types/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface MessageContextType {
  method: CommunicationType;
  setMethod: (method: CommunicationType) => void;
  subject: string | null;
  setSubject: (subject: string | null) => void;
  input: string;
  setInput: (input: string) => void;
  showOptions: boolean;
  setShowOptions: (value: boolean | ((prev: boolean) => boolean)) => void;
  showScripts: boolean;
  setShowScripts: (value: boolean | ((prev: boolean) => boolean)) => void;
  showVariables: boolean;
  setShowVariables: (value: boolean | ((prev: boolean) => boolean)) => void;
  resetMessage: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [method, setMethod] = useState<CommunicationType>("sms");
  const [subject, setSubject] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showScripts, setShowScripts] = useState<boolean>(false);
  const [showVariables, setShowVariables] = useState<boolean>(false);

  const resetMessage = () => {
    setMethod("sms");
    setSubject("");
    setInput("");
    setShowOptions(false);
    setShowScripts(false);
    setShowVariables(false);
  };

  return (
    <MessageContext.Provider
      value={{
        method,
        setMethod,
        subject,
        setSubject,
        input,
        setInput,
        showOptions,
        setShowOptions,
        showScripts,
        setShowScripts,
        showVariables,
        setShowVariables,
        resetMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
