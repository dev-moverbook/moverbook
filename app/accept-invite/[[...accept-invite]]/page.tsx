import { SignUp } from "@clerk/nextjs";

const AcceptInvitePage = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <SignUp />
    </div>
  );
};

export default AcceptInvitePage;
