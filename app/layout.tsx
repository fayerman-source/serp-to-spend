import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SERP-to-Spend",
  description:
    "Paste a keyword or competitor URL. Get SERP-grounded ad angles, platform-native copy, audience ideas, and a disapproval-risk check.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Varela Round */}
        <link
          href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            '"Varela Round", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          background: "#ffffff",
          color: "#1f2933",
        }}
      >
        {children}
      </body>
    </html>
  );
}
