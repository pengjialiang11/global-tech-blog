import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-bold text-lg">SinoTech Lens</p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Independent English coverage of China&apos;s frontier technology and industrial trends.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <Link href="/about" className="hover:text-black">About</Link>
            <Link href="/articles" className="hover:text-black">Articles</Link>
            <Link href="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-black">Disclaimer</Link>
            <Link href="/admin-login" className="hover:text-black">Admin</Link>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2026 SinoTechLens. All rights reserved.</p>
          <p>China Tech, in English.</p>
        </div>
      </div>
    </footer>
  );
}
