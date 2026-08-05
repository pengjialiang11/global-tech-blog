"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession, SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminInner>{children}</AdminInner>
    </SessionProvider>
  );
}

function AdminInner({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // 等登录状态完全加载完成后，再判断是否跳转
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/admin-login");
    }
  }, [isLoading, session, router]);

  // 加载中显示占位，避免页面闪烁
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // 未登录不渲染后台内容
  if (!session) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Article Manage", href: "/admin/articles" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Ads & Links", href: "/admin/ads" },
    { label: "Site Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8 border-b pb-4">Admin Panel</h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded ${path === item.href ? "bg-black text-white" : "hover:bg-gray-200"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-8 w-full py-2 border rounded hover:bg-gray-200"
        >
          Sign Out
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}