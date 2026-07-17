"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

// Header auth control, isolated as a client component so the shared SiteHeader
// in ui.tsx can stay a server component. Clerk v7 removed the <SignedIn> /
// <SignedOut> wrappers, so we branch on the useAuth() hook instead. Colors
// mirror the C.green / C.paper design tokens but are inlined to avoid a
// ui.tsx <-> this-file circular import.
export function AuthControl() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null; // avoid a sign-in -> account flash before Clerk resolves
  if (isSignedIn) return <UserButton />;
  return (
    <SignInButton mode="modal">
      <button
        style={{
          fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: "#f6f3ec",
          background: "#16463a",
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
