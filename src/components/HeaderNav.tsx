import Link from "next/link";
import { TRACKS } from "@/lib/tracks";

export default function HeaderNav() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SinoTech Lens</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              China Tech, in English
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {TRACKS.map((t) => (
              <Link key={t.slug} href={`/topics/${t.slug}`} className="text-gray-700 hover:text-black transition-colors">
                {t.name}
              </Link>
            ))}
            <Link href="/articles" className="text-gray-700 hover:text-black transition-colors">All Articles</Link>
            <Link href="/about" className="text-gray-700 hover:text-black transition-colors">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-black transition-colors">Contact</Link>
            <Link href="/admin-login" className="text-gray-500 hover:text-black transition-colors">Admin Login</Link>
          </nav>

          {/* Mobile menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <div className="md:hidden">
      <details className="group">
        <summary className="list-none cursor-pointer p-2 rounded hover:bg-gray-100">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </summary>
        <div className="absolute left-0 right-0 top-16 bg-white border-b shadow-lg p-4 space-y-2">
          {TRACKS.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}`} className="block py-2 text-gray-700 hover:text-black">
              {t.name}
            </Link>
          ))}
          <Link href="/articles" className="block py-2 text-gray-700 hover:text-black">All Articles</Link>
          <Link href="/about" className="block py-2 text-gray-700 hover:text-black">About</Link>
          <Link href="/contact" className="block py-2 text-gray-700 hover:text-black">Contact</Link>
          <Link href="/admin-login" className="block py-2 text-gray-500 hover:text-black">Admin Login</Link>
        </div>
      </details>
    </div>
  );
}
