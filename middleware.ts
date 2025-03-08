import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "./convex/_generated/api";
import { ErrorMessages } from "./types/errors";
import { ClerkRequest } from "@clerk/backend/internal";
import { ClerkRoles } from "./types/enums";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);
const isProtectedManagerRoute = createRouteMatcher([
  "/app/:slug/company-settings",
]);
const isProtectedAdminRoute = createRouteMatcher(["/app/:slug/stripe"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error(ErrorMessages.ENV_NEXT_PUBLIC_CONVEX_UR_NOT_SET);
  }

  const convex = new ConvexHttpClient(convexUrl);

  // Restrict admin routes to users with specific permissions
  if (path === "/") {
    const { userId, orgId } = await auth();
    // user creates a company if they don't belong to org
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
    await auth.protect((has) => {
      return (
        has({ role: ClerkRoles.ADMIN }) ||
        has(
          { role: ClerkRoles.MANAGER } ||
            has({ role: ClerkRoles.APP_MODERATOR })
        )
      );
    });
  }

  if (isProtectedAdminRoute(req)) {
    await auth.protect((has) => {
      return has({ role: ClerkRoles.ADMIN });
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
