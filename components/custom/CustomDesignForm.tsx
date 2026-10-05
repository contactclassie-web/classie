"use client";

import { useState } from "react";
import type { CustomPageConfig } from "@/lib/customDesigns";

interface Props {
  form: CustomPageConfig["form"];
  makeOptions: string[];
  metalOptions: string[];
  whatsappUrl: string;
}

const inp = "w-full border border-[#ECEAE6] bg-white px-3 py-2.5 font-sans text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#3B5373]";
const lab = "grid gap-1.5 font-sans text-[11.5px] font-medium text-[#1a1a1a]";

export default function CustomDesignForm({ form, makeOptions, metalOptions, whatsappUrl }: Props) {
  const [f, setF] = useState({
    name: "", phone: "", email: "", make: makeOptions[0] ?? "", metal: metalOptions[0] ?? "",
    pairs: "1", neededBy: "", link: "", details: "", consent: true, website: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, v: string | boolean) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/custom-design/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, pairs: Number(f.pairs) || 1 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't send. Please try again.");
      setState("done");
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Couldn't send. Please try again.");
      setState("error");
    }
  };

  const waText = encodeURIComponent(`Hi Classie, I just sent a custom design request (${f.make}). Here is my sketch/photo:`);
  const waLink = whatsappUrl ? `${whatsappUrl}${whatsappUrl.includes("?") ? "&" : "?"}text=${waText}` : "";

  if (state === "done") {
    return (
      <div className="border border-[#ECEAE6] bg-[#F7F4EF] p-6 md:p-8 grid gap-3 justify-items-start" role="status">
        <b className="font-serif font-normal text-[24px] md:text-[30px] text-[#1a1a1a]">{form.successText}</b>
        {form.replyNote && <p className="font-sans text-[13px] text-[#555]">{form.replyNote}</p>}
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-[#1E7A4C] text-white font-sans text-[11px] tracking-[0.16em] uppercase px-5 py-3.5">
            Send sketch on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 md:gap-x-5 max-w-[820px]">
      <label className={lab}>Your name *<input id="cd-name" required className={inp} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" /></label>
      <label className={lab}>WhatsApp number *<input id="cd-phone" required type="tel" inputMode="tel" className={inp} placeholder="10-digit mobile" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></label>
      <label className={lab}>Email (optional)<input id="cd-email" type="email" className={inp} value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
      {makeOptions.length > 0 && (
        <label className={lab}>What should we make?
          <select id="cd-make" className={inp} value={f.make} onChange={(e) => set("make", e.target.value)}>{makeOptions.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
      )}
      {metalOptions.length > 0 && (
        <label className={lab}>Metal &amp; stones
          <select id="cd-metal" className={inp} value={f.metal} onChange={(e) => set("metal", e.target.value)}>{metalOptions.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
      )}
      <label className={lab}>How many pairs?<input id="cd-pairs" type="number" min={1} max={500} className={inp} value={f.pairs} onChange={(e) => set("pairs", e.target.value)} /></label>
      <label className={lab}>Needed by<input id="cd-needed" className={inp} placeholder="e.g. 20 Nov, sister's wedding" value={f.neededBy} onChange={(e) => set("neededBy", e.target.value)} /></label>
      <label className={lab}>Design link (optional)<input id="cd-link" type="url" className={inp} placeholder="Pinterest, Instagram or Google Drive link" value={f.link} onChange={(e) => set("link", e.target.value)} /></label>
      <label className={`${lab} md:col-span-2`}>Describe your design *
        <textarea id="cd-details" required rows={4} className={inp} placeholder="Shape, colours, size, where you'll wear it…" value={f.details} onChange={(e) => set("details", e.target.value)} />
      </label>
      {/* Honeypot — hidden from people, bots fill it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden />
      {form.consentText && (
        <label className="md:col-span-2 flex items-start gap-2 font-sans text-[12px] text-[#555]">
          <input id="cd-consent" type="checkbox" className="mt-0.5" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
          {form.consentText}
        </label>
      )}
      {state === "error" && <p className="md:col-span-2 font-sans text-[12.5px] text-red-600" role="alert">{err}</p>}
      <button type="submit" disabled={state === "sending"}
        className="md:col-span-2 bg-[#3B5373] text-white font-sans text-[11.5px] tracking-[0.16em] uppercase py-4 hover:bg-[#2a3d55] disabled:opacity-60 transition-colors">
        {state === "sending" ? "Sending…" : form.buttonText || "Send my design"}
      </button>
      {form.replyNote && <p className="md:col-span-2 font-sans text-[11.5px] text-[#6b6b6b]">{form.replyNote}</p>}
    </form>
  );
}
