"use client";

import { BadgeButton } from "@/app/components/shared/buttons/BadgeButton";
import BadgeButtonGroup from "@/app/components/shared/containers/ BadgeButtonGroup";
import { useMessageContext } from "@/app/contexts/MessageContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useScriptsByCompanyId } from "@/app/hooks/queries/useScriptsByCompanyId";
import { ScriptSchema } from "@/types/convex-schemas";

interface MessageScriptsProps {}

const MessageScripts = ({}: MessageScriptsProps) => {
  const { companyId } = useSlugContext();
  const { method, setInput, setShowOptions, setShowScripts, setSubject } =
    useMessageContext();
  const { scripts, isLoading, isError, errorMessage } =
    useScriptsByCompanyId(companyId);

  const handleScriptClick = (script: ScriptSchema) => {
    setInput(script.message);
    if (script.emailTitle) {
      setSubject(script.emailTitle);
    }
    setShowOptions(false);
    setShowScripts(false);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Loading scripts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive text-center py-4">
        {errorMessage || "Failed to load scripts."}
      </div>
    );
  }

  const filteredScripts = scripts.filter((s) => s.type === method);

  if (filteredScripts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No {method.toUpperCase()} scripts available.
      </div>
    );
  }

  return (
    <BadgeButtonGroup>
      {filteredScripts.map((script) => (
        <BadgeButton key={script._id} onClick={() => handleScriptClick(script)}>
          {script.title}
        </BadgeButton>
      ))}
    </BadgeButtonGroup>
  );
};

export default MessageScripts;
