const clerkDomain = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;
if (!clerkDomain) {
  throw new Error(
    "Missing NEXT_PUBLIC_CLERK_FRONTEND_API environment variable"
  );
}

export default {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ],
};
