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
import { ClerkRoles } from "@/types/enums";
import NavLink from "./buttons/NavLink";
import type { UserResource } from "@clerk/types";
import { isCompanyAdminRole } from "@/app/frontendUtils/permissions";

type SidebarContentProps = {
  onNavigate?: () => void;
  slug: string;
  user?: UserResource | null;
};

const SidebarContent = ({ onNavigate, user, slug }: SidebarContentProps) => {
  if (!user) return null;
  const role = user.publicMetadata.role as ClerkRoles;
  const canSeeAdmin = isCompanyAdminRole(role);
  const roleLabel = role ?? "Unknown";

  return (
    <nav className="flex flex-col gap-2 bg-gray-800 text-white h-screen w-full">
      <div className="flex items-center  gap-x-2 px-4 h-14 py-3 ">
        <UserButton />
        <div className="flex flex-col items-start justify-center leading-tight">
          <p className="font-bold">{user.fullName}</p>
          <p className="text-xs">{roleLabel}</p>
        </div>
      </div>

      {/* Static buttons */}
      <NavLink href={`/app/${slug}`} onNavigate={onNavigate}>
        <Newspaper size={24} />
        News Feed
      </NavLink>

      <NavLink href={`/app/${slug}/calendar`} onNavigate={onNavigate}>
        <Calendar size={24} />
        Calendar
      </NavLink>
      <NavLink href={`/app/${slug}/messages`} onNavigate={onNavigate}>
        <MessageSquare size={24} />
        Messages
      </NavLink>

      <NavLink href={`/app/${slug}/analytics`} onNavigate={onNavigate}>
        <BarChart2 size={24} />
        Analytics
      </NavLink>

      <NavLink href={`/app/${slug}/team`} onNavigate={onNavigate}>
        <Users size={24} />
        Team
      </NavLink>

      {/* Routed buttons */}

      <NavLink href={`/app/${slug}/company-setup`} onNavigate={onNavigate}>
        <Briefcase size={24} />
        Company Setup
      </NavLink>

      <NavLink href={`/app/${slug}/move-setup`} onNavigate={onNavigate}>
        <Truck size={24} />
        Move Setup
      </NavLink>

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
