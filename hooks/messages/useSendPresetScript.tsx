"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { PresSetScripts } from "@/types/enums";

interface SendPresetScriptArgs {
  moveId: Id<"moves">;
  preSetTypes: PresSetScripts;
}

export const useSendPresetScript = () => {
  const [sendPresetScriptLoading, setSendPresetScriptLoading] =
    useState<boolean>(false);
  const [sendPresetScriptError, setSendPresetScriptError] = useState<
    string | null
  >(null);
  const sendPresetScriptMutation = useAction(
    api.actions.messages.sendPresetScript
  );

  const sendPresetScript = async ({
    moveId,
    preSetTypes,
  }: SendPresetScriptArgs): Promise<boolean> => {
    setSendPresetScriptLoading(true);
    setSendPresetScriptError(null);

    try {
      return await sendPresetScriptMutation({
        moveId,
        preSetTypes,
      });
    } catch (error) {
      setErrorFromConvexError(error, setSendPresetScriptError);
      return false;
    } finally {
      setSendPresetScriptLoading(false);
    }
  };

  return {
    sendPresetScript,
    sendPresetScriptLoading,
    sendPresetScriptError,
    setSendPresetScriptError,
  };
};
