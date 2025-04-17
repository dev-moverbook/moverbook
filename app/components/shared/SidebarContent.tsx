"use client";

import { useParams, useRouter } from "next/navigation";
import { useOrganization, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
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
import { ClerkRoleLabels, ClerkRoles } from "@/types/enums";

type SidebarContentProps = {
  onNavigate?: () => void;
};

const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { membership } = useOrganization();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const roleLabel =
    ClerkRoleLabels[membership?.role as ClerkRoles] ?? "Unknown";

  const handleNavigate = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  if (!user) return null;

  return (
    <nav className="flex flex-col gap-2 bg-gray-800 text-white h-screen">
      <div className="flex items-center  gap-x-2 px-4 h-14 py-3 ">
        <UserButton />
        <div className="flex flex-col items-start justify-center leading-tight">
          <p className="font-bold">{user.fullName}</p>
          <p className="text-xs">{roleLabel}</p>
        </div>
      </div>

      {/* Static buttons */}
      <Button
        variant="sidebar"
        className=""
        onClick={() => handleNavigate(`/app/${slug}`)}
      >
        <Newspaper size={24} />
        News Feed
      </Button>
      <Button variant="sidebar" className="">
        <Calendar size={24} />
        Calendar
      </Button>
      <Button variant="sidebar" className="">
        <MessageSquare size={24} />
        Messages
      </Button>
      <Button variant="sidebar" className="">
        <BarChart2 size={24} />
        Analytics
      </Button>

      {/* Routed buttons */}
      <Button
        variant="sidebar"
        className=""
        onClick={() => handleNavigate(`/app/${slug}/team`)}
      >
        <Users size={24} />
        Team
      </Button>

      <Button
        variant="sidebar"
        className=""
        onClick={() => handleNavigate(`/app/${slug}/company-setup`)}
      >
        <Briefcase size={24} />
        Company Setup
      </Button>

      <Button
        variant="sidebar"
        className=""
        onClick={() => handleNavigate(`/app/${slug}/move-setup`)}
      >
        <Truck size={24} />
        Move Setup
      </Button>

      <Button
        variant="sidebar"
        className=""
        onClick={() => handleNavigate(`/app/${slug}/stripe`)}
      >
        <CreditCard size={24} />
        Stripe
      </Button>
    </nav>
  );
};

export default SidebarContent;
