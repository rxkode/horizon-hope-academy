"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total_students: number;
  total_staff: number;
  payments_today: number;
  payments_this_term: number;
  attendance_today: number;
  pending_admissions: number;
}

function StatCard({ icon, label, value, sub, href, color = "border-white/10" }: {
  icon: string; label: string; value: string | number;
  sub?: string; href?: string; color?: string;
}) {
  const content = (
    <div className={`rounded-2xl border ${color} p-5 hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-200`}
      style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[1.5rem]">{icon}</span>
        {href && <span className="font-sans text-[0.65rem] text-white/30 hover:text-gold transition-colors">View →</span>}
      </div>
      <div className="font-serif text-[1.8rem] font-bold text-white leading-none mb-1">{value}</div>
      <div className="font-sans text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider">{label}</div>
      {sub && <div className="font-sans text-[0.68rem] text-white/35 mt-1">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date().toLocaleDateString("en-KE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  }));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("hha_admin_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setStats(await res.json());
      } catch {
        // Use placeholder stats if API not ready
        setStats({
          total_students: 0, total_staff: 4,
          payments_today: 0, payments_this_term: 0,
          attendance_today: 0, pending_admissions: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-white text-[1.4rem] font-bold mb-1">Dashboard</h2>
        <p className="font-sans text-white/40 text-[0.8rem]">{today}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-5 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)", height: "120px" }} />
          ))}
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon="🎓" label="Total Students"    value={stats?.total_students ?? 0}
              sub="Playgroup – Grade 4"          href="/admin/students"    color="border-blue-400/20" />
            <StatCard icon="👩‍🏫" label="Teaching Staff"   value={stats?.total_staff ?? 0}
              sub="Active staff members"         href="/admin/staff"       color="border-purple-400/20" />
            <StatCard icon="✅" label="Present Today"     value={stats?.attendance_today ?? 0}
              sub="Attendance marked"            href="/admin/attendance"  color="border-green-400/20" />
            <StatCard icon="💰" label="Payments Today"    value={`KES ${(stats?.payments_today ?? 0).toLocaleString()}`}
              sub="M-Pesa + Cash"                href="/admin/payments"    color="border-gold/20" />
            <StatCard icon="📊" label="Term Collections"  value={`KES ${(stats?.payments_this_term ?? 0).toLocaleString()}`}
              sub="Term 2, 2026"                 href="/admin/payments"    color="border-gold/20" />
            <StatCard icon="📋" label="Pending Enquiries" value={stats?.pending_admissions ?? 0}
              sub="New admissions"               href="/admin/students"    color="border-orange-400/20" />
          </div>

          {/* Quick actions */}
          <div className="mb-8">
            <h3 className="font-serif text-white text-[1rem] font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "➕", label: "Add Student",    href: "/admin/students/new"    },
                { icon: "✅", label: "Mark Attendance", href: "/admin/attendance/mark" },
                { icon: "💰", label: "Record Payment",  href: "/admin/payments/new"    },
                { icon: "📄", label: "Generate Report", href: "/admin/documents"       },
              ].map(a => (
                <Link key={a.label} href={a.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 hover:border-gold/30 hover:bg-white/[0.04] transition-all text-center">
                  <span className="text-[1.5rem]">{a.icon}</span>
                  <span className="font-sans text-[0.75rem] text-white/60 font-medium">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Classes overview */}
          <div>
            <h3 className="font-serif text-white text-[1rem] font-semibold mb-4">Classes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Playgroup","PP1","PP2","Grade 1","Grade 2","Grade 3","Grade 4"].map(cls => (
                <div key={cls}
                  className="rounded-2xl border border-white/10 p-4 hover:border-gold/20 transition-all"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="font-serif text-white font-semibold text-[0.9rem] mb-1">{cls}</div>
                  <div className="font-sans text-white/35 text-[0.7rem]">0 learners</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
