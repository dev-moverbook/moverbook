"use client";

import React, { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MoveCard from "@/app/components/move/MoveCard";
import TabSelector from "@/app/components/shared/TabSelector";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import DuplicateMoveModal from "../../customer/[customerId]/modals/DuplicateMoveModal";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { isMover } from "@/app/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";
import MoverStep from "./components/steps/MoverStep";
import InfoTab from "./components/tabs/InfoTab";

const MoveContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cleanSlug, user } = useSlugContext();

  const { moveData } = useMoveContext();
  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const { move, moveCustomer, salesRepUser } = moveData;

  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);
  const [activeTab, setActiveTab] = useState<string>("INFO");

  const tabs = useMemo<string[]>(
    () =>
      isMoverUser
        ? ["INFO", "ACTIVITES", "MOVE"]
        : ["INFO", "ACTIVITES", "MESSAGES"],
    [isMoverUser]
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (!isMoverUser && tab === "MESSAGES" && !pathname.endsWith("/messages")) {
      router.push(`${pathname}/messages`);
    }
  };

  const handleDuplicateMove = (m: Doc<"move">) => {
    setSelectedMove(m);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

  const completedWage =
    move.moveStatus === "Completed" ? moveData.myWage?.final : null;

  return (
    <main>
      <MoveCard
        move={move}
        moveCustomer={moveCustomer}
        showActions={!isMoverUser}
        asCustomerLink={isMoverUser}
        onDuplicate={handleDuplicateMove}
        salesRep={salesRepUser}
        slug={cleanSlug}
        isMover={isMoverUser}
        estimatedWage={
          moveData.myWage?.estimated
            ? { min: moveData.myWage.estimated, max: moveData.myWage.estimated }
            : null
        }
        hourStatus={moveData.myAssignment?.hourStatus}
        completedWage={completedWage}
      />

      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mt-4"
      />

      {activeTab === "INFO" && <InfoTab hideStepper={isMoverUser} />}
      {activeTab === "MOVE" && <MoverStep />}

      {selectedMove && isDuplicateMoveModalOpen && (
        <DuplicateMoveModal
          isOpen={isDuplicateMoveModalOpen}
          onClose={handleCloseDuplicateMoveModal}
          move={selectedMove}
        />
      )}
    </main>
  );
};

export default MoveContent;
