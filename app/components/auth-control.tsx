"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { C, sans } from "../theme";

// Header auth control, isolated as a client component so the shared SiteHeader
// in ui.tsx can stay a server component. Clerk v7 removed the <SignedIn> /
// <SignedOut> wrappers, so we branch on the useAuth() hook instead. Design
// tokens come from ../theme (shared with ui.tsx, no circular import).
export function AuthControl() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null; // avoid a sign-in -> account flash before Clerk resolves
  if (isSignedIn) return <UserButton />;
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        style={{
          fontFamily: sans,
          fontSize: 14,
          fontWeight: 600,
          color: C.paper,
          background: C.green,
          border: "none",
          borderRadius: 8,
          padding: "7px 16px",
          cursor: "pointer",
        }}
      >
        Sign in
      </button>
    </SignInButton>
  );
}
