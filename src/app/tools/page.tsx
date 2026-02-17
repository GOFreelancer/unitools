import type { Metadata } from "next";
import ToolsClient from "../../components/ToolsClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unitools-five.vercel.app";

export const metadata: Metadata = {
  title: "Tools — Unitools",
  description:
    "Explore Unitools: PDF, Image, Text, Developer, and Student utilities. Fast and private.",
  keywords: ["tools", "PDF tools", "image tools", "text tools", "developer"],
  alternates: {
    canonical: `${baseUrl}/tools`,
  },
  openGraph: {
    title: "Tools — Unitools",
    description:
      "Browse categories: PDF, Image, Text, Developer, Student. Fast and private.",
    url: `${baseUrl}/tools`,
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tools — Unitools",
    description: "Explore PDF, Image, Text, and Developer tools.",
  },
  robots: { index: true, follow: true },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tools</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Find the right tool. Fast, secure, and no data leaves your browser.
      </p>
      <ToolsClient />
      <section className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Categories</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold">PDF tools</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Merge and convert PDFs directly in your browser with reliable, privacy-first processing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Image tools</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Compress, convert, and package images while preserving quality. Everything runs on-device.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Text tools</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Analyze and transform text with live stats and simple utilities that help you focus.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Student tools</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Helpful study utilities to streamline common tasks and save time, without data leaving your device.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Developer tools</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Practical utilities that simplify everyday workflows for builders and maintainers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
