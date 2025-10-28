"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MoveCard from "@/components/move/MoveCard";
import TabSelector from "@/components/shared/tab/TabSelector";
import { useMoveContext } from "@/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import { useSlugContext } from "@/contexts/SlugContext";
import { canManageCompany, isMover } from "@/frontendUtils/permissions";
import MoverStep from "./components/steps/MoverStep";
import InfoTab from "./components/tabs/InfoTab";
import ShiftStep from "./components/steps/ShiftStep";
import SummaryTab from "./components/tabs/SummaryTab";
import DuplicateMoveModal from "../customer/modals/DuplicateMoveModal";
import FeedLoader from "./components/newsFeed/FeedContainer";

const MoveIdPage = () => {
  const router = useRouter();
  const { slug, user } = useSlugContext();
  const { moveData } = useMoveContext();
  const { wageDisplay } = moveData;

  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState<boolean>(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const { move, moveCustomer, salesRepUser } = moveData;
  const role = user.role;

  const isMoverUser = isMover(role);
  const isLeadMover = Boolean(isMoverUser && moveData.myAssignment?.isLead);
  const isManagement = canManageCompany(role);

  const [activeTab, setActiveTab] = useState<string>(
    isMoverUser ? "SHIFT" : "INFO"
  );

  const tabs = useMemo<string[]>(() => {
    if (isMoverUser) {
      const moverTabs = ["SHIFT", "INFO", "FEED"];
      if (isLeadMover) {
        moverTabs.push("MOVE");
      }
      if (isManagement) {
        moverTabs.push("SUMMARY");
      }
      return moverTabs;
    }
    const nonMoverTabs = ["INFO", "FEED"];
    if (isManagement) {
      nonMoverTabs.push("SUMMARY");
    }
    return nonMoverTabs;
  }, [isMoverUser, isLeadMover, isManagement]);

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const handleDuplicateMove = (m: Doc<"move">) => {
    setSelectedMove(m);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

  const hrefLink = isMoverUser
    ? `/app/${slug}/customer/${moveCustomer?._id}`
    : `/app/${slug}/moves/${move._id}`;

  const card = (
    <MoveCard
      move={move}
      moveCustomer={moveCustomer}
      showActions={!isMoverUser}
      onDuplicate={handleDuplicateMove}
      salesRep={salesRepUser}
      isMover={isMoverUser}
      hourStatus={moveData.myAssignment?.hourStatus}
      moverWageDisplay={wageDisplay}
      onMessagesClick={() =>
        router.push(`/app/${slug}/moves/${move._id}/messages`)
      }
      onViewCustomerClick={() =>
        router.push(`/app/${slug}/customer/${moveCustomer?._id}`)
      }
      onCardClick={() => router.push(hrefLink)}
    />
  );

  return (
    <main>
      {isMoverUser ? <Link href={hrefLink}>{card}</Link> : card}

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
      {activeTab === "FEED" && <FeedLoader />}

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

export default MoveIdPage;
