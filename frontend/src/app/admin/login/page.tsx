"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("hha_admin_token", data.access_token);
        localStorage.setItem("hha_admin_user", JSON.stringify(data.user));
        router.push("/admin");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #070e1e 0%, #0d1b45 50%, #070e1e 100%)" }}>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4" style={{ width: 90, height: 90 }}>
            <Image src="/assets/logo-navbar.png" alt="HHA" fill sizes="90px" className="object-contain"
              style={{ filter: "drop-shadow(0 8px 24px rgba(196,146,42,0.3))" }} />
          </div>
          <h1 className="font-serif text-white text-[1.3rem] font-bold text-center">
            Horizon Hope Academy
          </h1>
          <p className="font-sans text-white/40 text-[0.75rem] tracking-wider uppercase mt-1">
            School Management System
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/10 p-6"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
          <h2 className="font-serif text-white text-[1.1rem] font-semibold mb-5 text-center">
            Staff Login
          </h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="font-sans text-[0.78rem] text-red-400 text-center">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-sans font-semibold text-[0.88rem] tracking-wide transition-all duration-200 border border-gold text-gold-light hover:bg-gold hover:text-navy disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-white/25 text-[0.7rem] mt-4">
          Horizon Hope Academy © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
