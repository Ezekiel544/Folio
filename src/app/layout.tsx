import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folio – Portable prove of purchase, ownership & rights",
  description:
    "Folio turns every purchase into a portable signed receipt. Proof of purchase, ownership, transfers, rights and warranty — in one place, verifiable anywhere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
