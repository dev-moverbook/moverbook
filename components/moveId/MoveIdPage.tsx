"use client";

import { useMemo, useState } from "react";
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
  const { slug, user } = useSlugContext();
  const { moveData } = useMoveContext();
  const { wageDisplay } = moveData;

  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"moves"> | null>(null);

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

  const handleDuplicateMove = (move: Doc<"moves">) => {
    setSelectedMove(move);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

  const customerPageHref = `/app/${slug}/customer/${moveCustomer?._id}`;
  const movePageHref = `/app/${slug}/moves/${move._id}`;
  const messagesPageHref = `/app/${slug}/moves/${move._id}/messages`;

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
      messagesHref={messagesPageHref}
      customerHref={customerPageHref}
      navigateTo={isMoverUser ? customerPageHref : movePageHref}
    />
  );

  return (
    <main>
      {isMoverUser ? <Link href={customerPageHref}>{card}</Link> : card}

      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
