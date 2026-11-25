"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, List, LogOut, RefreshCw } from "lucide-react";

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  children: React.ReactNode;
}

export function AdminLayout({
  title,
  subtitle,
  onRefresh,
  refreshing,
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const nav = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/pitches", label: "All pitches", icon: List },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-zinc-800 bg-zinc-950/95 p-4 md:block">
        <Link href="/" className="font-mono text-xs text-emerald-400 hover:underline">
          ← BuildWithMe.dev
        </Link>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Admin
        </p>
        <nav className="mt-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-zinc-800 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-6 flex w-full items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      <div className="md:pl-56">
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur md:px-8">
          <MobileAdminNav nav={nav} pathname={pathname} onLogout={() => void logout()} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-500">
                BuildWithMe Studio
              </p>
              <h1 className="mt-1 text-xl font-bold text-zinc-50 md:text-2xl">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
              )}
            </div>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-emerald-600"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            )}
          </div>
        </header>
        <div className="px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}

function MobileAdminNav({
  nav,
  pathname,
  onLogout,
}: {
  nav: { href: string; label: string; icon: typeof LayoutDashboard }[];
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <div className="mb-4 flex gap-2 md:hidden">
      {nav.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`rounded-md px-3 py-1.5 text-xs ${
            pathname === href
              ? "bg-emerald-500 text-zinc-950"
              : "border border-zinc-700 text-zinc-400"
          }`}
        >
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={onLogout}
        className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-500"
      >
        Log out
      </button>
    </div>
  );
}