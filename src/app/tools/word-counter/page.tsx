import type { Metadata } from "next";
import Link from "next/link";
import WordCounterClient from "../../../components/WordCounterClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unitools-five.vercel.app";

export const metadata: Metadata = {
  title: "Word Counter — Unitools",
  description:
    "Count words, characters, sentences, paragraphs, and reading time. Works locally in your browser.",
  keywords: ["word counter", "character count", "reading time", "text tools"],
  alternates: {
    canonical: `${baseUrl}/tools/word-counter`,
  },
  openGraph: {
    title: "Word Counter — Unitools",
    description:
      "Live word and character counts with reading time, all in-browser.",
    url: `${baseUrl}/tools/word-counter`,
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Word Counter — Unitools",
    description: "Live word and character counts with reading time.",
  },
  robots: { index: true, follow: true },
};

export default function WordCounterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Word Counter</h1>
        <Link href="/tools" className="text-blue-600 hover:underline text-sm">
          ← Back to Tools
        </Link>
      </div>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">
        Count words, characters, sentences, and paragraphs with live updates. Reading time assumes 200 words per minute.
      </p>

      <WordCounterClient />

      <section className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How to use</h2>
        <div className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>Paste or type your text into the large input area.</p>
          <p>View live word, character, sentence, and paragraph counts as you type.</p>
          <p>Use Copy Text to copy the entire content, or Clear Text to reset the input.</p>
          <p>Your text is saved locally and remains after page refresh.</p>
        </div>
      </section>

      <div className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
        InContentAd Placeholder
      </div>

      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold">How accurate is the word count?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              The count uses whitespace separation, which matches most editors and browsers for typical text.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How are sentences and paragraphs detected?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              Sentences are split on punctuation such as period, exclamation, and question marks. Paragraphs are detected from non-empty lines.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is my text uploaded or tracked?</h3>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              No. Your content stays on-device. Local storage is used so the text persists after refresh.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
