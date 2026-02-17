import type { Metadata } from "next";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unitools-five.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy — Unitools",
  description: "Unitools is privacy-first: tools run locally and data stays on-device.",
  keywords: ["privacy policy", "data privacy", "on-device processing"],
  alternates: { canonical: `${baseUrl}/privacy-policy` },
  openGraph: {
    title: "Privacy Policy — Unitools",
    description: "Learn how Unitools keeps your data on-device and private.",
    url: `${baseUrl}/privacy-policy`,
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — Unitools",
    description: "Privacy-first tools, data stays on your device.",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Unitools is privacy-first. Tools run locally in your browser. We do not upload files or collect personal content.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Data</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Your inputs stay on-device. Temporary data is kept in memory and not transmitted to servers.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Analytics</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Minimal, anonymous usage metrics may be used to improve tools. No tracking or profiling.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Contact</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Questions? Reach us via the Contact page.
      </p>
    </div>
  );
}
