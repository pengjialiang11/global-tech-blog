import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 网站Logo/名称，点击返回首页 */}
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
          SinoTech Lens
        </Link>

        {/* 导航菜单 */}
        <nav className="flex gap-8 text-lg">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/articles" className="text-gray-700 hover:text-blue-600 transition-colors">All Articles</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}