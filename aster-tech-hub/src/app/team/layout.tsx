import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Team Workspace | Aster Tech Hub",
  description: "Internal task management and collaboration for the Aster Tech Hub team.",
  robots: "noindex, nofollow",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireTeam={true}>
      {children}
    </AuthGuard>
  );
}
