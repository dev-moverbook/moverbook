"use client";

import React, { useState } from "react";
import ScriptsSection from "../sections/ScriptsSection";
import VariablesSection from "../sections/VariablesSection";
import { useSlugContext } from "@/contexts/SlugContext";
import { CommunicationType } from "@/types/types";
import { FrontEndErrorMessages } from "@/types/errors";
import { useCreateScript } from "@/hooks/stripe";
import CreateScriptModal from "../modals/CreateScriptModal";
import { useDeleteScript } from "@/hooks/scripts";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useUpdateScript } from "@/hooks/scripts";
import { useScriptsAndVariables } from "@/hooks/scripts/useScriptsAndVariables";
import VerticalSectionGroup from "@/components/shared/section/VerticalSectionGroup";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";

type UpdateScriptData = {
  title?: string;
  type?: CommunicationType;
  message?: string;
  emailTitle?: string;
};

const ScriptsTab = () => {
  const { companyId } = useSlugContext();

  const { createScript, createLoading, createError } = useCreateScript();

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
  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [editingScript, setEditingScript] = useState<Doc<"scripts"> | null>(
    null
  );

  const result = useScriptsAndVariables(companyId);

  const handleCreateScript = async (
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ): Promise<boolean> => {
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
    if (!scriptId) {
      return false;
    }

    const updates: UpdateScriptData = { title, type, message, emailTitle };
    const success = await updateScript(scriptId, updates);
    if (success) {
      setIsScriptModalOpen(false);
      setEditingScript(null);
    }
    return success;
  };

  let content: React.ReactNode;

  switch (result) {
    case undefined:
      content = null;
      break;

    default: {
      const { scripts, variables } = result;

      content = (
        <>
          <ScriptsSection
            scripts={scripts}
            setIsScriptModalOpen={setIsScriptModalOpen}
            setEditingScript={setEditingScript}
            onDeleteClick={handleDeleteClick}
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

          <ConfirmModal
            title="Confirm Delete"
            description="Are you sure you want to delete this script?"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
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
