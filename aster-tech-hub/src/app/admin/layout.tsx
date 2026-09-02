import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Admin Console | Aster Tech Hub",
  description: "Management and analytics dashboard for Aster Tech Hub administration.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin={true}>
      {children}
    </AuthGuard>
  );
}
