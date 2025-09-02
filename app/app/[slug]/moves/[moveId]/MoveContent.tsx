"use client";

import React, { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MoveCard from "@/app/components/move/MoveCard";
import TabSelector from "@/app/components/shared/TabSelector";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import DuplicateMoveModal from "../../customer/[customerId]/modals/DuplicateMoveModal";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { canManageCompany, isMover } from "@/app/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";
import MoverStep from "./components/steps/MoverStep";
import InfoTab from "./components/tabs/InfoTab";
import ShiftStep from "./components/steps/ShiftStep";
import SummaryTab from "./components/tabs/SummaryTab";

const MoveContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cleanSlug, user } = useSlugContext();

  const { moveData } = useMoveContext();
  const { wageDisplay } = moveData;
  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const { move, moveCustomer, salesRepUser } = moveData;
  const role = user.publicMetadata.role as ClerkRoles;

  const isMoverUser = isMover(role);
  const isLeadMover = Boolean(isMoverUser && moveData.myAssignment?.isLead);
  const isManagement = canManageCompany(role);

  const [activeTab, setActiveTab] = useState<string>(
    isMoverUser ? "SHIFT" : "INFO"
  );
  const tabs = useMemo<string[]>(() => {
    if (isMoverUser) {
      const moverTabs = ["SHIFT", "INFO", "FEED"];
      if (isLeadMover) moverTabs.push("MOVE");
      if (isManagement) moverTabs.push("SUMMARY");
      return moverTabs;
    }

    const nonMoverTabs = ["INFO", "FEED"];
    if (isManagement) nonMoverTabs.push("SUMMARY");
    return nonMoverTabs;
  }, [isMoverUser, isLeadMover, isManagement]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDuplicateMove = (m: Doc<"move">) => {
    setSelectedMove(m);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

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
        hourStatus={moveData.myAssignment?.hourStatus}
        moverWageDisplay={wageDisplay}
      />

      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mt-4"
      />

      {activeTab === "INFO" && <InfoTab hideStepper={isMoverUser} />}
      {activeTab === "SHIFT" && <ShiftStep />}
      {activeTab === "MOVE" && isLeadMover && <MoverStep />}

      {activeTab === "SUMMARY" && isManagement && <SummaryTab />}

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
