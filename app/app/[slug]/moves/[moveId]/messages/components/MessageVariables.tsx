"use client";

import { BadgeButton } from "@/app/components/shared/buttons/BadgeButton";
import BadgeButtonGroup from "@/app/components/shared/containers/ BadgeButtonGroup";
import { useMessageContext } from "@/app/contexts/MessageContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useVariablesByCompanyId } from "@/app/hooks/queries/useVariablesByCompanyId";
import { MessageVariablesTarget } from "@/types/types";

interface MessageVariablesProps {
  target: MessageVariablesTarget;
}

const MessageVariables = ({ target }: MessageVariablesProps) => {
  const { companyId } = useSlugContext();
  const {
    input,
    setInput,
    subject,
    setSubject,
    setShowOptions,
    setShowVariables,
  } = useMessageContext();

  const { variables, isLoading, isError, errorMessage } =
    useVariablesByCompanyId(companyId);

  const handleVariableClick = (variable: string) => {
    const formatted = `{{${variable}}}`;

    if (target === "subject") {
      setSubject(subject + formatted);
    } else {
      setInput(input + formatted);
    }

    setShowOptions(false);
    setShowVariables(false);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Loading variables...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive text-center py-4">
        {errorMessage || "Failed to load variables."}
      </div>
    );
  }

  if (variables.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No variables available.
      </div>
    );
  }

  return (
    <BadgeButtonGroup>
      {variables.map((v) => (
        <BadgeButton key={v._id} onClick={() => handleVariableClick(v.name)}>
          <span className="font-medium">{v.name}</span>
        </BadgeButton>
      ))}
    </BadgeButtonGroup>
  );
};

export default MessageVariables;
