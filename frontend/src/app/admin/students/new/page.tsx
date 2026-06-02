"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Class { id: number; name: string; }

interface FormState {
  first_name: string; middle_name: string; last_name: string;
  date_of_birth: string; gender: string; class_id: string;
  nemis_number: string; birth_cert_number: string; medical_notes: string;
  guardian_name: string; guardian_phone: string; guardian_phone2: string;
  guardian_email: string; guardian_relationship: string;
}

/* ── Field component defined OUTSIDE page — prevents remount on keystroke ── */
function Field({ label, name, type = "text", required = false, placeholder = "", value, onChange }: {
  label: string; name: string; type?: string; required?: boolean;
  placeholder?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">
        {label}{required && " *"}
      </label>
      <input type={type} name={name} required={required} placeholder={placeholder}
        value={value} onChange={onChange}
        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors" />
    </div>
  );
}

export default function NewStudentPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState<FormState>({
    first_name: "", middle_name: "", last_name: "",
    date_of_birth: "", gender: "", class_id: "",
    nemis_number: "", birth_cert_number: "", medical_notes: "",
    guardian_name: "", guardian_phone: "", guardian_phone2: "",
    guardian_email: "", guardian_relationship: "parent",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const token  = typeof window !== "undefined" ? localStorage.getItem("hha_admin_token") : "";

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/admin/classes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setClasses).catch(console.error);
  }, []);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, class_id: parseInt(form.class_id) }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/students/${data.id}`);
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to add student");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/students" className="font-sans text-white/40 hover:text-white text-[0.82rem] transition-colors">
          ← Students
        </Link>
        <span className="text-white/20">/</span>
        <h2 className="font-serif text-white text-[1.2rem] font-bold">Add New Student</h2>
      </div>

      <form onSubmit={submit} className="space-y-6">

        {/* Student details */}
        <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
          <h3 className="font-serif text-white font-semibold mb-4">🎓 Student Information</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <Field label="First Name"  name="first_name"  required placeholder="e.g. Amani"   value={form.first_name}   onChange={handle} />
            <Field label="Middle Name" name="middle_name"          placeholder="e.g. Wachira" value={form.middle_name}  onChange={handle} />
            <Field label="Last Name"   name="last_name"   required placeholder="e.g. Kamau"   value={form.last_name}    onChange={handle} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">Class *</label>
              <select name="class_id" required value={form.class_id} onChange={handle}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white focus:outline-none focus:border-gold/40 transition-colors">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">Gender</label>
              <select name="gender" value={form.gender} onChange={handle}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white focus:outline-none focus:border-gold/40 transition-colors">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Field label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handle} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="NEMIS / UPI Number"    name="nemis_number"      placeholder="e.g. 12345678" value={form.nemis_number}      onChange={handle} />
            <Field label="Birth Certificate No"  name="birth_cert_number" placeholder="e.g. 1234567"  value={form.birth_cert_number} onChange={handle} />
          </div>
        </div>

        {/* Guardian details */}
        <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
          <h3 className="font-serif text-white font-semibold mb-4">👨‍👩‍👧 Parent / Guardian Information</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Field label="Guardian Full Name" name="guardian_name" required placeholder="e.g. Jane Wanjiku" value={form.guardian_name} onChange={handle} />
            <div>
              <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">Relationship *</label>
              <select name="guardian_relationship" value={form.guardian_relationship} onChange={handle}
                className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white focus:outline-none focus:border-gold/40 transition-colors">
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="grandparent">Grandparent</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Field label="Primary Phone"   name="guardian_phone"  required placeholder="+254 7XX XXX XXX" value={form.guardian_phone}  onChange={handle} />
            <Field label="Secondary Phone" name="guardian_phone2"          placeholder="+254 7XX XXX XXX" value={form.guardian_phone2} onChange={handle} />
          </div>
          <Field label="Email Address" name="guardian_email" type="email" placeholder="parent@email.com" value={form.guardian_email} onChange={handle} />
        </div>

        {/* Medical notes */}
        <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
          <h3 className="font-serif text-white font-semibold mb-4">🏥 Medical Notes</h3>
          <div>
            <label className="block font-sans text-[0.72rem] text-white/50 mb-1.5 uppercase tracking-wider">
              Allergies, Conditions, Special Needs
            </label>
            <textarea name="medical_notes" rows={3} value={form.medical_notes} onChange={handle}
              placeholder="e.g. Allergic to penicillin. Asthmatic — has inhaler."
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 font-sans text-[0.88rem] text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-colors resize-none" />
          </div>
        </div>

        {error && <p className="font-sans text-[0.82rem] text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-xl font-sans font-semibold text-[0.88rem] border border-gold text-gold-light hover:bg-gold hover:text-navy transition-all disabled:opacity-50">
            {loading ? "Saving..." : "✅ Save Student"}
          </button>
          <Link href="/admin/students"
            className="px-6 py-2.5 rounded-xl font-sans text-[0.88rem] border border-white/15 text-white/50 hover:text-white transition-all">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
