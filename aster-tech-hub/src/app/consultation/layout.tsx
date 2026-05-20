import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Consultation – Aster Tech Hub | Start Your Digital Project",
  description: "Book a free consultation with Aster Tech Hub. Tell us about your project and our expert team will create a custom digital strategy — web development, AI, marketing and more.",
  keywords: ["free IT consultation India", "web development consultation", "digital project planning", "Aster Tech Hub contact", "hire web developer Davangere"],
  openGraph: {
    title: "Free Consultation – Aster Tech Hub",
    description: "Get a personalised consultation from Aster Tech Hub's expert team. We build web apps, mobile apps, AI tools and more.",
    url: "https://astertechhub.com/consultation",
    siteName: "Aster Tech Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://astertechhub.com/consultation" },
};

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
