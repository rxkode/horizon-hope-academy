"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/admin",              icon: "📊", label: "Dashboard"   },
  { href: "/admin/students",     icon: "🎓", label: "Students"    },
  { href: "/admin/staff",        icon: "👩‍🏫", label: "Staff"       },
  { href: "/admin/attendance",   icon: "✅", label: "Attendance"  },
  { href: "/admin/assessments",  icon: "📋", label: "Assessments" },
  { href: "/admin/payments",     icon: "💰", label: "Payments"    },
  { href: "/admin/payroll",      icon: "💼", label: "Payroll"     },
  { href: "/admin/expenses",     icon: "🧾", label: "Expenses"    },
  { href: "/admin/notices",      icon: "📢", label: "Notices"     },
  { href: "/admin/documents",    icon: "📄", label: "Documents"   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Simple auth check — token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("hha_admin_token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  const logout = () => {
    localStorage.removeItem("hha_admin_token");
    localStorage.removeItem("hha_admin_user");
    // Clear session cookie
    document.cookie = "hha_session=; path=/; max-age=0; SameSite=Strict";
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a1228" }}>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        transition-all duration-300
        ${open ? "w-56" : "w-14"}
        lg:relative lg:w-56
      `} style={{ background: "#070e1e", borderRight: "0.5px solid rgba(196,146,42,0.15)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 border-b" style={{ borderColor: "rgba(196,146,42,0.1)" }}>
          <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
            <Image src="/assets/logo-navbar.png" alt="HHA" fill sizes="36px" className="object-contain" />
          </div>
          <span className={`font-serif text-white text-[0.8rem] font-semibold leading-tight transition-all ${open ? "opacity-100" : "opacity-0 lg:opacity-100"}`}>
            HHA Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all text-[0.82rem] font-sans ${
                  active
                    ? "bg-gold/15 text-gold-light border border-gold/25"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}>
                <span className="text-[1rem] flex-shrink-0">{item.icon}</span>
                <span className={`transition-all whitespace-nowrap ${open ? "opacity-100" : "opacity-0 lg:opacity-100"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(196,146,42,0.1)" }}>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/[0.06] transition-all text-[0.82rem] font-sans">
            <span className="text-[1rem]">🚪</span>
            <span className={`transition-all ${open ? "opacity-100" : "opacity-0 lg:opacity-100"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ background: "#070e1e", borderColor: "rgba(196,146,42,0.1)" }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setOpen(o => !o)}>
              ☰
            </button>
            <h1 className="font-serif text-white text-[1rem] font-semibold">
              Horizon Hope Academy — School Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[0.75rem] text-white/40 hidden sm:block">
              Term 2, 2026
            </span>
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-[0.7rem] font-bold text-gold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
