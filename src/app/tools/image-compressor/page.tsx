import type { Metadata } from "next";
import Link from "next/link";
import ImageCompressorClient from "../../../components/ImageCompressorClient";

export const metadata: Metadata = {
  title: "Image Compressor — Unitools",
  description:
    "Compress images (JPG, PNG, WEBP) fully in your browser. Adjust quality, format, and size. Download individually or as ZIP.",
  keywords: ["image compressor", "compress JPG", "compress PNG", "compress WEBP"],
  alternates: {
    canonical: "https://unitools.local/tools/image-compressor",
  },
  openGraph: {
    title: "Image Compressor — Unitools",
    description:
      "Compress and convert images locally. Adjust quality, format, and size.",
    url: "https://unitools.local/tools/image-compressor",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Compressor — Unitools",
    description: "Compress and convert images locally in your browser.",
  },
  robots: { index: true, follow: true },
};

export default function ImageCompressorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Image Compressor</h1>
        <Link href="/tools" className="text-blue-600 hover:underline text-sm">
          ← Back to Tools
        </Link>
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">
        Upload one or more images and compress them locally. Adjust quality, output format, and optional resize. Files never leave your device.
      </p>

      <div className="mt-6">
        <ImageCompressorClient />
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How to use</h2>
        <div className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>Upload images (JPG, PNG, WEBP). Preview thumbnails and original sizes.</p>
          <p>Adjust Quality, Output Format, and optional Resize Width, then compress.</p>
          <p>Download each compressed image or all as a ZIP.</p>
          <p>Your files are processed in-browser only and never uploaded.</p>
        </div>
      </section>

      <div className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
        InContentAd Placeholder
      </div>

      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold">Does compression happen on a server?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              No. The tool uses your browser’s canvas to compress images locally.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Which formats are supported?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              JPG, PNG, and WEBP. You can keep the original format or convert.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Does Quality affect PNG?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Quality applies to JPG/WEBP. PNG is lossless; use Resize or convert to change size.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
