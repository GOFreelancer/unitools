import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Unitools",
  description: "Contact Unitools for feedback and feature requests.",
  keywords: ["contact Unitools", "feedback", "support"],
  alternates: { canonical: "https://unitools.local/contact" },
  openGraph: {
    title: "Contact — Unitools",
    description: "Reach out with feedback and feature requests.",
    url: "https://unitools.local/contact",
    siteName: "Unitools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact — Unitools",
    description: "Get in touch with Unitools.",
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Have feedback or feature requests? We would love to hear from you.
      </p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            rows={5}
            className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us what you need..."
          />
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
