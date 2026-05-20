import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Support Tickets | Aster Tech Hub",
  description: "Raise and track your support tickets with the Aster Tech Hub team.",
  robots: "noindex, nofollow",
};

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
