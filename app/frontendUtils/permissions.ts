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
