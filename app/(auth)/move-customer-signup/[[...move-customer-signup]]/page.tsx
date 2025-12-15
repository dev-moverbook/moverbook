import { SignUp } from "@clerk/nextjs";

const FINAL_DESTINATION_ROUTE =
  "/app/based123p/moves/qh73xqgedkbva24yew9pr3eh3d7xbsaf";

const MoveCustomerSignupPage = () => {
  const encodedNextUrl = encodeURIComponent(FINAL_DESTINATION_ROUTE);

  const WAITING_PAGE_URL = `/auth/waiting?nextUrl=${encodedNextUrl}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignUp signInForceRedirectUrl={WAITING_PAGE_URL} />
    </div>
  );
};

export default MoveCustomerSignupPage;
