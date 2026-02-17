import type { Metadata } from "next";
import Link from "next/link";
import QRGeneratorClient from "../../../components/QRGeneratorClient";

export const metadata: Metadata = {
  title: "QR Code Generator — Unitools",
  description:
    "Generate QR codes for URLs, WhatsApp links, and WiFi. Preview live and download PNG. All in-browser.",
  keywords: ["QR code", "WhatsApp link", "WiFi QR", "URL QR"],
  alternates: {
    canonical: "https://unitools.local/tools/qr-generator",
  },
  openGraph: {
    title: "QR Code Generator — Unitools",
    description:
      "Create QR codes for text/URLs, WhatsApp links, and WiFi. Works fully in-browser.",
    url: "https://unitools.local/tools/qr-generator",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QR Code Generator — Unitools",
    description: "Create QR codes for text/URLs, WhatsApp, and WiFi.",
  },
  robots: { index: true, follow: true },
};

export default function QrGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">QR Code Generator</h1>
        <Link href="/tools" className="text-blue-600 hover:underline text-sm">
          ← Back to Tools
        </Link>
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">
        Create QR codes for text/URLs, WhatsApp links, or WiFi networks. Works fully in your browser. Download as PNG.
      </p>

      <div className="mt-6">
        <QRGeneratorClient />
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How to use</h2>
        <div className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>Select the QR type (URL/Text, WhatsApp, or WiFi).</p>
          <p>Fill in the fields. Preview updates live as you type.</p>
          <p>Choose the size and click Download PNG to save the QR.</p>
          <p>For WhatsApp links, you can also copy the generated link.</p>
        </div>
      </section>

      <div className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
        InContentAd Placeholder
      </div>

      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold">Which QR types are supported?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              URL/Text, WhatsApp links (phone + message), and WiFi (SSID, password, encryption).
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Does this upload my data?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              No. Everything runs in your browser. QR codes are generated client-side only.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Which encryption should I pick for WiFi?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Choose WPA or WEP based on your router configuration. Use None for open networks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
