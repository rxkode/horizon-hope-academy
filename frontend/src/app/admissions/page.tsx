"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { AdmissionFormData } from "@/types";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

const grades = ["PP1","PP2","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"];

const empty: AdmissionFormData = {
  guardian_name: "", guardian_email: "", guardian_phone: "",
  child_name: "", child_age: 5, grade_applying: "Grade 1", message: "",
};

export default function AdmissionsPage() {
  const [form, setForm] = useState<AdmissionFormData>(empty);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const set = (k: keyof AdmissionFormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: k === "child_age" ? Number(e.target.value) : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.submitAdmission(form);
      setStatus("success");
      setForm(empty);
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setStatus("error");
    }
  };

  const field = "w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-mist/40 font-sans text-sm outline-none focus:border-gold/50 transition-colors";

  return (
    <div className="min-h-screen pt-[68px] topo-bg">
      <div className="absolute inset-0 bg-navy-gradient pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 py-20">
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}}>
          <SectionLabel>Admissions</SectionLabel>
          <h1 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-bold mb-3">Enrol Your Child</h1>
          <p className="font-sans text-[0.92rem] text-mist/80 font-light leading-relaxed max-w-xl mb-12">
            Fill in the form below and our admissions team will be in touch within 2 working days. We welcome all learners from PP1 to Grade 9.
          </p>
        </motion.div>

        {status === "success" ? (
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-serif text-2xl font-bold mb-2">Application Received!</h2>
            <p className="font-sans text-mist/80 text-sm mb-6">Thank you. Our admissions team will contact you within 2 working days.</p>
            <Button onClick={() => setStatus("idle")}>Submit Another →</Button>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="glass rounded-2xl p-8 md:p-10">
            <h2 className="font-serif text-xl font-semibold mb-6 text-gold-light">Guardian / Parent Details</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Full Name *</label>
                <input required className={field} value={form.guardian_name} onChange={set("guardian_name")} placeholder="e.g. James Wachira" />
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Email Address *</label>
                <input required type="email" className={field} value={form.guardian_email} onChange={set("guardian_email")} placeholder="james@example.com" />
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Phone Number *</label>
                <input required className={field} value={form.guardian_phone} onChange={set("guardian_phone")} placeholder="0712 345 678" />
              </div>
            </div>

            <h2 className="font-serif text-xl font-semibold mb-6 text-gold-light">Child's Details</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Child's Full Name *</label>
                <input required className={field} value={form.child_name} onChange={set("child_name")} placeholder="e.g. Amani Wachira" />
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Child's Age *</label>
                <input required type="number" min={3} max={18} className={field} value={form.child_age} onChange={set("child_age")} />
              </div>
              <div>
                <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Grade Applying For *</label>
                <select required className={field} value={form.grade_applying} onChange={set("grade_applying")}>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block font-sans text-xs text-mist/70 mb-1.5 tracking-wide uppercase">Additional Message (optional)</label>
              <textarea rows={4} className={`${field} resize-none`} value={form.message} onChange={set("message")} placeholder="Any additional information about your child..." />
            </div>

            {status === "error" && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-sans">
                ⚠️ {errMsg}
              </div>
            )}

            <Button type="submit" disabled={status === "loading"} variant="primary" className="w-full justify-center">
              {status === "loading" ? "Submitting..." : "Submit Application →"}
            </Button>
            <p className="font-sans text-[0.68rem] text-mist/40 mt-3 text-center">
              Your data is handled under the Kenya Data Protection Act 2019. We never share personal information.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
