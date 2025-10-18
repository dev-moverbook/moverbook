"use client";

import { BadgeButton } from "@/components/shared/buttons/BadgeButton";
import BadgeButtonGroup from "@/components/shared/containers/BadgeButtonGroup";
import { useMessageContext } from "@/contexts/MessageContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { useVariablesByCompanyId } from "@/hooks/variables/useVariablesByCompanyId";
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

  const variables = useVariablesByCompanyId(companyId);

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

  if (!variables) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Loading variables...
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
