"use client";

import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/tombs", label: "Tombs", icon: "⚰️" },
    { href: "/admin/persons", label: "Persons", icon: "👤" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-gray-900 text-white transition-all duration-300 overflow-y-auto`}
        >
          <div className="p-4 border-b border-gray-700">
            <h1 className={`font-bold text-xl ${!isSidebarOpen && "text-center"}`}>
              {isSidebarOpen ? "Memorial" : "M"}
            </h1>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-600"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <Button
              onClick={() => signOut({ redirect: true })}
              variant="danger"
              className="w-full justify-center"
            >
              {isSidebarOpen ? "Logout" : "X"}
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ☰
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Memorial Registry Admin
            </h2>
            <div className="w-8" />
          </header>

          <div className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
