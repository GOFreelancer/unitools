import type { Metadata } from "next";
import PDFEditorWrapper from "../../../components/PDFEditorWrapper";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unitools-five.vercel.app";

export const metadata: Metadata = {
  title: "PDF Editor — Unitools",
  description:
    "Edit PDFs easily: draw, erase, add images, and write text — all locally in your browser.",
  keywords: ["pdf editor", "edit pdf", "draw on pdf", "sign pdf", "annotate pdf"],
  alternates: {
    canonical: `${baseUrl}/tools/pdf-editor`,
  },
  openGraph: {
    title: "PDF Editor — Unitools",
    description:
      "Edit PDFs easily: draw, erase, add images, and write text — all locally in your browser.",
    url: `${baseUrl}/tools/pdf-editor`,
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF Editor — Unitools",
    description: "Edit PDFs easily: draw, erase, add images, and write text.",
  },
  robots: { index: true, follow: true },
};

export default function PDFEditorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PDF Editor</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Edit PDFs easily: draw, erase, add images, and write text — all locally in your browser.
      </p>
      <PDFEditorWrapper />
    </div>
  );
}
