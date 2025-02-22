"use client";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <SignUp />
    </div>
  );
}
