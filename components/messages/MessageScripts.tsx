"use client";

import { BadgeButton } from "@/components/shared/buttons/BadgeButton";
import BadgeButtonGroup from "@/components/shared/containers/ BadgeButtonGroup";
import { useMessageContext } from "@/contexts/MessageContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { useScriptsByCompanyId } from "@/hooks/scripts/useScriptsByCompanyId";
import { Doc } from "@/convex/_generated/dataModel";

const MessageScripts = () => {
  const { companyId } = useSlugContext();
  const { method, setInput, setShowOptions, setShowScripts, setSubject } =
    useMessageContext();
  const scripts = useScriptsByCompanyId(companyId);

  const handleScriptClick = (script: Doc<"scripts">) => {
    setInput(script.message);
    if (script.emailTitle) {
      setSubject(script.emailTitle);
    }
    setShowOptions(false);
    setShowScripts(false);
  };

  if (!scripts) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Loading scripts...
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
