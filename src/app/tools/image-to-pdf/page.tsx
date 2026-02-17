import type { Metadata } from "next";
import Link from "next/link";
import ImageToPdfClient from "../../../components/ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF Converter — Unitools",
  description:
    "Convert multiple images (JPG, PNG, WEBP) to a single PDF in your browser. Reorder, set page size, orientation, margins, and quality.",
  keywords: ["image to pdf", "convert images to pdf", "jpg to pdf", "png to pdf"],
  alternates: {
    canonical: "https://unitools.local/tools/image-to-pdf",
  },
  openGraph: {
    title: "Image to PDF Converter — Unitools",
    description:
      "Convert images to PDF locally. Drag reorder, choose page size, orientation, margins, quality.",
    url: "https://unitools.local/tools/image-to-pdf",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image to PDF Converter — Unitools",
    description: "Convert images to PDF locally with drag reorder and options.",
  },
  robots: { index: true, follow: true },
};

export default function ImageToPdfPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Image to PDF Converter</h1>
        <Link href="/tools" className="text-blue-600 hover:underline text-sm">
          ← Back to Tools
        </Link>
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">
        Upload images, drag to reorder, and generate a PDF fully in your browser. Files never leave your device.
      </p>

      <div className="mt-6">
        <ImageToPdfClient />
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How to use</h2>
        <div className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>Upload JPG, PNG, or WEBP images and preview thumbnails.</p>
          <p>Drag and drop thumbnails to reorder pages.</p>
          <p>Select Page Size (A4, Letter, Fit), Orientation, Margin, and Image Quality.</p>
          <p>Click Generate PDF, then Download PDF. Everything runs in your browser only.</p>
        </div>
      </section>

      <div className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
        InContentAd Placeholder
      </div>

      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold">Is the PDF generation done on a server?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              No. The PDF is built entirely in your browser using client-side libraries.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I mix different image formats?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Yes. You can upload JPG, PNG, and WEBP together and reorder them freely.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What does “Fit to image” do?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Each page size matches the image’s dimensions, preserving its aspect ratio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
