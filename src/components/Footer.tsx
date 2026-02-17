import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black font-bold">U</span>
              <span className="text-lg font-semibold">Unitools</span>
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
              Free online utility tools. Fast, secure, and privacy-first.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-blue-600" href="/tools">Tools</Link></li>
              <li><Link className="hover:text-blue-600" href="/about">About</Link></li>
              <li><Link className="hover:text-blue-600" href="/contact">Contact</Link></li>
              <li><Link className="hover:text-blue-600" href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-blue-600" href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300">
          © {new Date().getFullYear()} Unitools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
