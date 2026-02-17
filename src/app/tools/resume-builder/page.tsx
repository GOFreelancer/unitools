import Link from "next/link";
export default function ResumeBuilderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">Resume Builder</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Placeholder: create an ATS-friendly resume template and export.
      </p>
      <div className="mt-6">
        <Link href="/tools" className="text-blue-600 hover:underline">
          ← Back to Tools
        </Link>
      </div>
    </div>
  );
}
