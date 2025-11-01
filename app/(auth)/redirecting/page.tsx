import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import ErrorMessage from "@/components/shared/error/ErrorMessage";
import { UserRole } from "@/types/enums";
import RedirectingPage from "@/components/redirecting/RedirectingPage";

export default async function Page() {
  const { userId, orgRole, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken({ template: "convex" });
  if (!token) {
    return <ErrorMessage message="You must be signed in to view this page." />;
  }

  const companyData = await fetchQuery(
    api.companies.getCompanyClerkUserId,
    { clerkUserId: userId },
    { token }
  );

  if (companyData === null || !companyData.company || !companyData.user) {
    if (orgRole === UserRole.ADMIN) {
      redirect("/app/onboarding");
    }
    return <ErrorMessage message="No company found for this account." />;
  }

  if (orgRole === UserRole.APP_MODERATOR) {
    redirect(`/app/admin/companies`);
  }

  return (
    <RedirectingPage
      desiredOrgId={companyData.company?.clerkOrganizationId}
      slug={companyData.company?.slug}
    />
  );
}
