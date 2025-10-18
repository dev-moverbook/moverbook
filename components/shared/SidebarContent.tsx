"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Newspaper,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  BarChart2,
  Briefcase,
  Truck,
} from "lucide-react";
import NavLink from "./buttons/NavLink";
import {
  canCreateMove,
  canManageCompany,
  isCompanyAdminRole,
} from "@/frontendUtils/permissions";
import { useSlugContext } from "@/contexts/SlugContext";

type SidebarContentProps = {
  onNavigate?: () => void;
};

const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  const { isCompanyContactComplete, isStripeComplete, slug, user } =
    useSlugContext();

  const role = user.role;
  const canSeeAdmin = isCompanyAdminRole(role);
  const canSeeMovePages = canCreateMove(role);
  const canSeeCompanySetup = canManageCompany(role);
  const roleLabel = role ?? "Unknown";
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  return (
    <nav className="flex flex-col gap-2  text-white h-screen w-full">
      <div className="flex items-center  gap-x-2 px-4 h-14 py-3 ">
        <UserButton />
        <div className="flex flex-col items-start justify-center leading-tight">
          <p className="font-bold">{user.name}</p>
          <p className="text-xs">{roleLabel}</p>
        </div>
      </div>

      <NavLink
        href={`/app/${slug}`}
        onNavigate={onNavigate}
        disabled={isAddMoveDisabled}
      >
        <Newspaper size={24} />
        News Feed
      </NavLink>

      <NavLink
        href={`/app/${slug}/calendar`}
        onNavigate={onNavigate}
        disabled={isAddMoveDisabled}
      >
        <Calendar size={24} />
        Calendar
      </NavLink>
      {canSeeMovePages && (
        <>
          <NavLink
            href={`/app/${slug}/messages`}
            onNavigate={onNavigate}
            disabled={isAddMoveDisabled}
          >
            <MessageSquare size={24} />
            Messages
          </NavLink>
          <NavLink
            href={`/app/${slug}/analytics`}
            onNavigate={onNavigate}
            disabled={isAddMoveDisabled}
          >
            <BarChart2 size={24} />
            Analytics
          </NavLink>
          <NavLink href={`/app/${slug}/team`} onNavigate={onNavigate}>
            <Users size={24} />
            Team
          </NavLink>
        </>
      )}

      {canSeeCompanySetup && (
        <>
          <NavLink href={`/app/${slug}/company-setup`} onNavigate={onNavigate}>
            <Briefcase size={24} />
            Company Setup
          </NavLink>

          <NavLink href={`/app/${slug}/move-setup`} onNavigate={onNavigate}>
            <Truck size={24} />
            Move Setup
          </NavLink>
        </>
      )}

      {canSeeAdmin && (
        <NavLink href={`/app/${slug}/stripe`} onNavigate={onNavigate}>
          <CreditCard size={24} />
          Stripe
        </NavLink>
      )}
    </nav>
  );
};

export default SidebarContent;
