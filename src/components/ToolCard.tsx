import Link from "next/link";
import type { Tool } from "../data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-md transition-shadow bg-white dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{tool.name}</h3>
        <span className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
          {tool.category}
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        {tool.description}
      </p>
      <div className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
        Open Tool →
      </div>
    </Link>
  );
}
