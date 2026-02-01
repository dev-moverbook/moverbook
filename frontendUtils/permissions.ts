import { ClerkRoles } from "@/types/enums";

export const isCompanyAdminRole = (role?: string): boolean => {
  return role === ClerkRoles.ADMIN;
};

export const canManageCompany = (role?: string): boolean => {
  return (
    role === ClerkRoles.ADMIN ||
    role === ClerkRoles.APP_MODERATOR ||
    role === ClerkRoles.MANAGER
  );
};

export const canCreateMove = (role?: string): boolean => {
  return (
    role === ClerkRoles.ADMIN ||
    role === ClerkRoles.MANAGER ||
    role === ClerkRoles.APP_MODERATOR ||
    role === ClerkRoles.SALES_REP
  );
};

export const isMover = (role?: string | null): boolean => {
  return role === ClerkRoles.MOVER;
};


