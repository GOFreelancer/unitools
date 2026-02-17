import type { Metadata } from "next";
import HomeClient from "../components/HomeClient";

export const metadata: Metadata = {
  title: "Unitools — Free Online Tools",
  description: "Free Online Tools – Fast, Secure, No Upload. Works offline.",
  keywords: ["Unitools", "online tools", "PDF", "Image", "Text", "Developer"],
  alternates: {
    canonical: "https://unitools.local/",
  },
  openGraph: {
    title: "Unitools — Free Online Tools",
    description:
      "Fast, secure, and privacy-first utility tools. No uploads, works offline.",
    url: "https://unitools.local/",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Unitools — Free Online Tools",
    description: "Fast, secure, privacy-first utility tools. Works offline.",
  },
  robots: { index: true, follow: true },
};

export default function Home() {
  return <HomeClient />;
}
