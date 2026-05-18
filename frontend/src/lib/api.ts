/**
 * API client — all calls to FastAPI backend.
 * Base URL from environment so it works locally AND on Vercel.
 */
import { AdmissionFormData, ContactFormData } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  submitAdmission: (data: AdmissionFormData) =>
    post("/admissions/", data),
  submitContact: (data: ContactFormData) =>
    post("/contact/", data),
};
