"use client";

import React, { useState } from "react";
import ScriptsSection from "../sections/ScriptsSection";
import VariablesSection from "../sections/VariablesSection";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { CommunicationType } from "@/types/types";
import { FrontEndErrorMessages } from "@/types/errors";
import { useCreateScript } from "../hooks/useCreateScript";
import CreateScriptModal from "../modals/CreateScriptModal";
import { useDeleteScript } from "../hooks/useDeleteScript";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { ScriptSchema } from "@/types/convex-schemas";
import { useUpdateScript } from "../hooks/useUpdateScript";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import { useScriptsAndVariables } from "@/app/hooks/queries/scripts/useScriptsAndVariables";
import { QueryStatus } from "@/types/enums";
import VerticalSectionGroup from "@/app/components/shared/VerticalSectionGroup";

type UpdateScriptData = {
  title?: string;
  type?: CommunicationType;
  message?: string;
  emailTitle?: string;
};

const ScriptsTab = () => {
  const { companyId } = useSlugContext();

  const { createScript, createLoading, createError, setCreateError } =
    useCreateScript();

  const {
    updateScript,
    updateLoading: updateScriptLoading,
    updateError: updateErrorLoading,
    setUpdateError: setUpdateScriptError,
  } = useUpdateScript();

  const { deleteScript, deleteLoading, deleteError, setDeleteError } =
    useDeleteScript();

  const [deleteScriptId, setDeleteScriptId] = useState<Id<"scripts"> | null>(
    null
  );
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<ScriptSchema | null>(null);

  const result = useScriptsAndVariables(companyId ?? null);

  const handleCreateScript = async (
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ): Promise<boolean> => {
    if (!companyId) {
      console.error(FrontEndErrorMessages.COMPANY_NOT_FOUND);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    }
    return await createScript({ companyId, title, type, message, emailTitle });
  };

  const handleDeleteClick = (scriptId: Id<"scripts">) => {
    setDeleteScriptId(scriptId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteScriptId) {
      setUpdateScriptError(FrontEndErrorMessages.GENERIC);
      return;
    }
    const success = await deleteScript(deleteScriptId);
    if (success) setIsDeleteModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteScriptId(null);
    setDeleteError(null);
  };

  const handleEditScript = async (
    scriptId: Id<"scripts">,
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ): Promise<boolean> => {
    if (!scriptId) return false;

    const updates: UpdateScriptData = { title, type, message, emailTitle };
    const success = await updateScript(scriptId, updates);
    if (success) {
      setIsScriptModalOpen(false);
      setEditingScript(null);
    }
    return success;
  };

  let content: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;

    case QueryStatus.ERROR:
      content = <ErrorMessage message={result.errorMessage} />;
      break;

    case QueryStatus.SUCCESS: {
      const { scripts, variables } = result;

      content = (
        <>
          <ScriptsSection
            scripts={scripts}
            setIsScriptModalOpen={setIsScriptModalOpen}
            onDeleteClick={handleDeleteClick}
            onEdit={setEditingScript}
          />

          <VariablesSection variables={variables} />

          <CreateScriptModal
            isOpen={isScriptModalOpen}
            onClose={() => {
              setIsScriptModalOpen(false);
              setEditingScript(null);
            }}
            onCreate={handleCreateScript}
            onEdit={handleEditScript}
            createLoading={editingScript ? updateScriptLoading : createLoading}
            createError={editingScript ? updateErrorLoading : createError}
            variables={variables}
            editingScript={editingScript}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={handleConfirmDelete}
            deleteLoading={deleteLoading}
            deleteError={deleteError}
          />
        </>
      );
      break;
    }
  }

  return <VerticalSectionGroup>{content}</VerticalSectionGroup>;
};

export default ScriptsTab;
