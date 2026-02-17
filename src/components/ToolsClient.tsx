"use client";
import { useMemo, useState } from "react";
import { tools, type ToolCategory } from "../data/tools";
import ToolCard from "./ToolCard";

const categories: ToolCategory[] = [
  "PDF",
  "Image",
  "Text",
  "Developer",
  "Student",
];

export default function ToolsClient() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<ToolCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesQuery =
        !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchesCat = activeCat === "All" || t.category === activeCat;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCat]);

  return (
    <div>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat("All")}
            className={`px-3 py-2 rounded-lg border text-sm ${activeCat === "All" ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 dark:border-neutral-700"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-3 py-2 rounded-lg border text-sm ${activeCat === c ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 dark:border-neutral-700"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            No tools match your search.
          </div>
        )}
      </div>
    </div>
  );
}
