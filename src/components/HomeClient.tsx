"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { tools } from "../data/tools";
import ToolCard from "./ToolCard";

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="bg-white dark:bg-black">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Free Online Tools – Fast, Secure, No Upload
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Unitools runs in your browser. Your files never leave your device. Built for speed and privacy.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/tools"
              className="rounded-lg bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700"
            >
              Browse Tools
            </Link>
            <a
              href="#search"
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
            >
              Search Tools
            </a>
          </div>
        </div>
      </section>

      <section id="search" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link
              href="/tools"
              className="w-full sm:w-auto rounded-lg bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700 text-center"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Popular Tools
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-neutral-50 dark:bg-neutral-900">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Why Unitools
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold">Privacy-first</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                No uploads. Everything runs locally in your browser.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Fast</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Optimized for instant results with modern web tech.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Works offline</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Many tools continue to work without an internet connection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
