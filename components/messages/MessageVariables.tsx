"use client";

import { BadgeButton } from "@/components/shared/buttons/BadgeButton";
import BadgeButtonGroup from "@/components/shared/containers/BadgeButtonGroup";
import { useMessageContext } from "@/contexts/MessageContext";
import { TEMPLATE_VARIABLES } from "@/types/const";
import { MessageVariablesTarget } from "@/types/types";

interface MessageVariablesProps {
  target: MessageVariablesTarget;
}

const MessageVariables = ({ target }: MessageVariablesProps) => {
  const {
    input,
    setInput,
    subject,
    setSubject,
    setShowOptions,
    setShowVariables,
  } = useMessageContext();

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

  const variables = Object.values(TEMPLATE_VARIABLES);

  if (variables.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No variables available.
      </div>
    );
  }

  return (
    <BadgeButtonGroup>
      {variables.map((variable) => (
        <BadgeButton
          key={variable}
          onClick={() => handleVariableClick(variable)}
        >
          <span className="font-medium">{variable}</span>
        </BadgeButton>
      ))}
    </BadgeButtonGroup>
  );
};

export default MessageVariables;
