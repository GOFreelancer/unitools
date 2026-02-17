import Link from "next/link";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black font-bold">U</span>
          <span className="text-xl font-semibold tracking-tight">Unitools</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/tools" className="hover:text-blue-600">Tools</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </nav>
        <div className="md:hidden">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/tools" className="hover:text-blue-600">Tools</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
