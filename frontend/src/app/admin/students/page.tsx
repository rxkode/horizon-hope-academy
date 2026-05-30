"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student {
  id: number;
  admission_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  class_name: string;
  gender: string;
  status: string;
  enrolled_date: string;
}

interface Class {
  id: number;
  name: string;
}

export default function StudentsPage() {
  const [students, setStudents]   = useState<Student[]>([]);
  const [classes,  setClasses]    = useState<Class[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [search,   setSearch]     = useState("");
  const [classFilter, setClassFilter] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const token  = typeof window !== "undefined" ? localStorage.getItem("hha_admin_token") : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          fetch(`${apiUrl}/api/v1/admin/students`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/v1/admin/classes`,  { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (sRes.ok) setStudents(await sRes.json());
        if (cRes.ok) setClasses(await cRes.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = students.filter(s => {
    const name = `${s.first_name} ${s.last_name} ${s.admission_number}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchClass  = classFilter ? s.class_name === classFilter : true;
    return matchSearch && matchClass;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-white text-[1.4rem] font-bold mb-1">Students</h2>
          <p className="font-sans text-white/40 text-[0.8rem]">{students.length} learners enrolled</p>
        </div>
        <Link href="/admin/students/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-[0.82rem] font-semibold border border-gold text-gold-light hover:bg-gold hover:text-navy transition-all">
          ➕ Add Student
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text" placeholder="Search by name or admission number..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2 font-sans text-[0.85rem] text-white placeholder-white/30 focus:outline-none focus:border-gold/40 transition-colors"
        />
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
          className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2 font-sans text-[0.85rem] text-white focus:outline-none focus:border-gold/40 transition-colors">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-[3rem] mb-3">🎓</div>
          <p className="font-serif text-white text-[1.1rem] font-semibold mb-2">No students yet</p>
          <p className="font-sans text-white/40 text-[0.85rem] mb-5">Add your first learner to get started.</p>
          <Link href="/admin/students/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gold text-gold-light font-sans text-[0.85rem] font-semibold hover:bg-gold hover:text-navy transition-all">
            ➕ Add First Student
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                <th className="text-left px-4 py-3 font-sans text-[0.68rem] font-bold tracking-wider uppercase text-white/40">Admission No</th>
                <th className="text-left px-4 py-3 font-sans text-[0.68rem] font-bold tracking-wider uppercase text-white/40">Name</th>
                <th className="text-left px-4 py-3 font-sans text-[0.68rem] font-bold tracking-wider uppercase text-white/40 hidden sm:table-cell">Class</th>
                <th className="text-left px-4 py-3 font-sans text-[0.68rem] font-bold tracking-wider uppercase text-white/40 hidden md:table-cell">Gender</th>
                <th className="text-left px-4 py-3 font-sans text-[0.68rem] font-bold tracking-wider uppercase text-white/40">Status</th>
                <th className="text-left px-4 py-3 font-sans text-[0.68rem] font-bold tracking-wider uppercase text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}
                  style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
                  className="hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 font-sans text-[0.8rem] text-gold-light font-mono">{s.admission_number}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-soft to-gold/30 flex items-center justify-center text-[0.65rem] font-bold text-white flex-shrink-0">
                        {s.first_name[0]}{s.last_name[0]}
                      </div>
                      <div>
                        <div className="font-sans text-[0.85rem] font-medium text-white">
                          {s.first_name} {s.middle_name ? s.middle_name[0] + ". " : ""}{s.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-[0.82rem] text-white/60 hidden sm:table-cell">{s.class_name}</td>
                  <td className="px-4 py-3 font-sans text-[0.82rem] text-white/60 hidden md:table-cell capitalize">{s.gender}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
                      s.status === "active"
                        ? "bg-green-400/10 border border-green-400/25 text-green-300"
                        : "bg-red-400/10 border border-red-400/25 text-red-300"
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${s.id}`}
                      className="font-sans text-[0.78rem] text-gold-light hover:text-gold transition-colors">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
