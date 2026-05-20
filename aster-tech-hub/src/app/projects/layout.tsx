import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects – Aster Tech Hub | Digital Innovation Portfolio",
  description: "Explore Aster Tech Hub's project portfolio — e-commerce platforms, AI systems, mobile apps, and more. Real results delivered for real businesses across India and beyond.",
  keywords: ["Aster Tech Hub projects", "web development portfolio India", "digital agency case studies", "e-commerce development", "AI project portfolio"],
  openGraph: {
    title: "Our Projects – Aster Tech Hub Portfolio",
    description: "See the innovative digital projects built by Aster Tech Hub — from e-commerce to AI-powered platforms.",
    url: "https://astertechhub.com/projects",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com/projects" },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
