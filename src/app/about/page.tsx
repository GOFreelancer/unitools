import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Unitools",
  description: "Learn about Unitools: privacy-first, fast, in-browser tools.",
  keywords: ["about Unitools", "privacy-first tools", "online utilities"],
  alternates: { canonical: "https://unitools.local/about" },
  openGraph: {
    title: "About — Unitools",
    description: "Privacy-first, fast, in-browser utility tools.",
    url: "https://unitools.local/about",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About — Unitools",
    description: "Learn about the Unitools mission and approach.",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">About Unitools</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Unitools is a collection of free online utilities designed with privacy and speed in mind.
        Tools run in your browser, keeping your data on-device. No sign ups, no tracking, no uploads.
      </p>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        Built with Next.js and Tailwind CSS, optimized for accessibility, performance, and mobile responsiveness.
      </p>
    </div>
  );
}
