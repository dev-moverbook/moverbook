import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "./convex/_generated/api";
import { ErrorMessages } from "./types/errors";
import { ClerkRoles } from "./types/enums";
import { clientEnv } from "./frontendUtils/clientEnv";
import {
  isCompanyAdminRole,
  isMoveCustomer,
} from "./frontendUtils/permissions";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);
const isProtectedManagerRoute = createRouteMatcher([
  "/app/[slug]/company-settings",
]);
const isProtectedAdminRoute = createRouteMatcher(["/app/(.*)/stripe"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  const convexUrl = clientEnv().NEXT_PUBLIC_CONVEX_URL;

  const convex = new ConvexHttpClient(convexUrl);

  const authData = await auth();
  const userRole = authData.sessionClaims?.userRole as ClerkRoles;

  const userId = authData.userId;
  const orgId = authData.orgId;

  if (path === "/") {
    if (isMoveCustomer(userRole)) {
      return NextResponse.next();
    }

    if (userId && !orgId) {
      return NextResponse.redirect(new URL("/app/onboarding", req.url));
    }
    if (userId && orgId) {
      try {
        const company = await convex.query(api.companies.getCompanyClerkOrgId, {
          clerkOrgId: orgId!,
        });

        if (!company) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.redirect(new URL(`/app/${company.slug}`, req.url));
      } catch (error) {
        console.error(ErrorMessages.MIDDLEWARE_REDIRECT_HOME, error);
      }
    }
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  if (isProtectedManagerRoute(req)) {
    // const isAllowedPermission = isMoveCustomer(userRole);

    await auth.protect((has) => {
      return (
        has({ role: ClerkRoles.ADMIN }) ||
        has({ role: ClerkRoles.MANAGER }) ||
        has({ role: ClerkRoles.APP_MODERATOR })
      );
    });
  }

  if (isProtectedAdminRoute(req)) {
    const preventAccess = !isCompanyAdminRole(userRole);

    if (preventAccess) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
