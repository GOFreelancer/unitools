import type { Metadata } from "next";
import Link from "next/link";
import PDFMergeClient from "../../../components/PDFMergeClient";

export const metadata: Metadata = {
  title: "PDF Merger — Unitools",
  description:
    "Merge multiple PDFs in your browser. Reorder, remove, and download. No uploads.",
  keywords: ["pdf merge", "merge pdfs", "combine pdf", "pdf tools"],
  alternates: {
    canonical: "https://unitools.local/tools/pdf-merge",
  },
  openGraph: {
    title: "PDF Merger — Unitools",
    description:
      "Merge PDFs locally. Reorder files, remove, and download. No uploads.",
    url: "https://unitools.local/tools/pdf-merge",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF Merger — Unitools",
    description: "Merge PDFs locally with reorder and remove options.",
  },
  robots: { index: true, follow: true },
};

export default function PdfMergePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">PDF Merger</h1>
        <Link href="/tools" className="text-blue-600 hover:underline text-sm">
          ← Back to Tools
        </Link>
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">
        Upload multiple PDFs, reorder pages by file, and merge them locally. Files never leave your device.
      </p>

      <div className="mt-6">
        <PDFMergeClient />
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How to use</h2>
        <div className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>Upload PDF files and review their names and sizes.</p>
          <p>Use drag-and-drop or arrow buttons to reorder files.</p>
          <p>Click Merge PDFs and then Download to save the final document.</p>
          <p>Processing happens in your browser only. No uploads.</p>
        </div>
      </section>

      <div className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
        InContentAd Placeholder
      </div>

      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold">Does merging happen on a server?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              No. Merging uses client-side libraries and runs entirely in your browser.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I remove a file before merging?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Yes. Use Remove to exclude any file from the final PDF.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What if I upload a non-PDF?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              The tool validates files and shows a friendly error message for unsupported types.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
