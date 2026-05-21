import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import VisitorTracker from "@/components/VisitorTracker";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.astertechhub.in'),
  title: {
    default: "Aster Tech Hub | Empower Your Business",
    template: "%s | Aster Tech Hub"
  },
  description:
    "IT Services | Digital Marketing | Innovation Hub - Pioneering the next generation of digital infrastructure from Davangere, India.",
  keywords: ["IT Services Davangere", "Web Development Davangere", "Digital Marketing Davangere", "Software Development India", "Aster Tech Hub"],
  authors: [{ name: "Aster Tech Hub Team" }],
  creator: "Aster Tech Hub",
  publisher: "Aster Tech Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "sAkC1SamPra8k4QpesKuhph3hMeSzlYeUDgCqXwck74",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.astertechhub.in",
    siteName: "Aster Tech Hub",
    title: "Aster Tech Hub | Empower Your Business",
    description: "Pioneering the next generation of digital infrastructure and IT services.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aster Tech Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aster Tech Hub | Empower Your Business",
    description: "Pioneering the next generation of digital infrastructure and IT services.",
    images: ["/og-image.png"],
    creator: "@astertechhub",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface font-body antialiased selection:bg-primary/30 min-h-screen flex flex-col">
        {/* Navbar - Fixed at top */}
        <Navbar />

        {/* Main Content - Grows to fill space */}
        <main className="flex-grow pt-20">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Cookie Consent Popup */}
        <CookieConsent />

        {/* Analytics Tracker */}
        <VisitorTracker />
      </body>
    </html>
  );
}

