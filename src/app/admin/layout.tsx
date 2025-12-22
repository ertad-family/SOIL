import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin | SOIL",
  description: "SOIL Administration Dashboard",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-marble-100 transition-colors">
                &larr; Back to SOIL
              </Link>
              <span className="text-slate-600">|</span>
              <h1 className="text-lg font-semibold text-marble-100">Admin Dashboard</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                href="/admin/analytics"
                className="text-sm text-slate-400 hover:text-marble-100 transition-colors"
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
