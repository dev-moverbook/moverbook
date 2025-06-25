"use client";

import { useState } from "react";
import { RefreshCcw, Plus } from "lucide-react";
import { useMessageContext } from "@/app/contexts/MessageContext";
import { BadgeButton } from "@/app/components/shared/buttons/BadgeButton";
import { MessageVariablesTarget } from "@/types/types";
import BadgeButtonGroup from "@/app/components/shared/containers/ BadgeButtonGroup";

interface Props {
  showScripts: () => void;
  showVariables: (target: MessageVariablesTarget) => void;
  toggleMethod: () => void;
}

const MessageOptions = ({
  showScripts,
  showVariables,
  toggleMethod,
}: Props) => {
  const { method } = useMessageContext();
  const [showVariableTargetSelector, setShowVariableTargetSelector] =
    useState(false);

  const handleVariableClick = () => {
    if (method === "email") {
      setShowVariableTargetSelector(true);
    } else {
      showVariables("body");
    }
  };

  return (
    <div className="pl-10 space-y-2">
      {!showVariableTargetSelector && (
        <BadgeButtonGroup>
          <BadgeButton onClick={toggleMethod}>
            <RefreshCcw className="w-4 h-4 mr-1" />
            to {method === "sms" ? "Email" : "SMS"}
          </BadgeButton>

          <BadgeButton onClick={showScripts}>
            <Plus className="w-4 h-4 mr-1" />
            Scripts
          </BadgeButton>

          <BadgeButton onClick={handleVariableClick}>
            <Plus className="w-4 h-4 mr-1" />
            Variables
          </BadgeButton>
        </BadgeButtonGroup>
      )}

      {showVariableTargetSelector && method === "email" && (
        <BadgeButtonGroup>
          <BadgeButton
            onClick={() => {
              showVariables("subject");
              setShowVariableTargetSelector(false);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Subject Variable
          </BadgeButton>
          <BadgeButton
            onClick={() => {
              showVariables("body");
              setShowVariableTargetSelector(false);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Body Variable
          </BadgeButton>
        </BadgeButtonGroup>
      )}
    </div>
  );
};

export default MessageOptions;
