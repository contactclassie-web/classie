"use client";
import { useState } from "react";

function BottomBorderField({ icon, name, type = "text", placeholder, value, onChange, required }: {
  icon: string; name: string; type?: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div className="flex items-center border-b border-[#d0d0d0] focus-within:border-[#3B5373] transition-colors pb-1">
      {icon && <span className="text-base mr-3 text-[#888] select-none flex-shrink-0">{icon}</span>}
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
        required={required}
        className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#aaa] outline-none py-1.5" />
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setStatus("idle"); setErrorMsg("");
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ first_name: "", last_name: "", email: "", phone: "", message: "" });
      } else { setStatus("error"); setErrorMsg(data.error || "Something went wrong."); }
    } catch { setStatus("error"); setErrorMsg("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  if (status === "success") return (
    <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
      <p className="text-green-700 font-medium mb-1">Message sent! ✅</p>
      <p className="text-green-600 text-sm">We'll get back to you within 24–48 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <div className="grid grid-cols-2 gap-4">
        <BottomBorderField icon="👤" name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <BottomBorderField icon="" name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
      </div>
      <BottomBorderField icon="@" name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
      <BottomBorderField icon="📞" name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
      <div className="flex items-start border-b border-[#d0d0d0] focus-within:border-[#3B5373] transition-colors pb-1">
        <span className="text-base mt-2 mr-3 text-[#888] select-none">💬</span>
        <textarea name="message" placeholder="Your message…" value={form.message} onChange={handleChange}
          required rows={4} className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#aaa] outline-none resize-none py-1" />
      </div>
      <button type="submit" disabled={submitting}
        className="w-full py-3.5 bg-[#3B5373] text-white font-medium text-sm tracking-wide hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
        {submitting ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
