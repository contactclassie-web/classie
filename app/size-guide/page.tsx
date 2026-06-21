import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Size Guide — CLASSIE",
  description: "Find your perfect fit with the Classie heel size guide — measurements, how-to steps, and expert fit tips.",
};

const DEFAULT_STEPS = [
  "Step 1: Place a blank sheet of paper on a flat floor",
  "Step 2: Stand on the paper with your heel against a wall",
  "Step 3: Mark the tip of your longest toe with a pencil",
  "Step 4: Measure the distance from the wall to the mark in centimetres",
  "Step 5: Use the chart below to find your size",
];

const DEFAULT_CHART = [
  { eu: "35", uk: "2", in: "3", cm: "22.0" },
  { eu: "36", uk: "3", in: "4", cm: "22.5–23.0" },
  { eu: "37", uk: "4", in: "5", cm: "23.5" },
  { eu: "38", uk: "5", in: "6", cm: "24.0–24.5" },
  { eu: "39", uk: "6", in: "7", cm: "25.0" },
  { eu: "40", uk: "7", in: "8", cm: "25.5–26.0" },
  { eu: "41", uk: "8", in: "9", cm: "26.5" },
];

export default async function SizeGuidePage() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await sb.from("site_settings").select("key,value").like("key", "sg_%");
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  const c = (key: string, def: string) =>
    cfg[key] !== undefined && cfg[key] !== "" ? cfg[key] : def;

  // Steps
  const stepsRaw = c("sg_measure_steps", DEFAULT_STEPS.join("\n"));
  const steps = stepsRaw.split("\n").map((s) => s.trim()).filter(Boolean);

  // Chart rows
  let chartRows: { eu: string; uk: string; in: string; cm: string }[] = DEFAULT_CHART;
  try {
    const parsed = JSON.parse(cfg.sg_chart_json || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) chartRows = parsed;
  } catch {
    chartRows = DEFAULT_CHART;
  }

  return (
    <>
      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: "#3B5373" }}
      >
        <p
          className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {c("sg_eyebrow", "CLASSIE")}
        </p>
        <h1
          className="font-serif text-5xl sm:text-6xl font-light mb-5"
          style={{ color: "#fff" }}
        >
          {c("sg_heading", "Size Guide")}
        </h1>
        <p
          className="text-base sm:text-lg max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {c("sg_sub", "Find your perfect fit — every time")}
        </p>
      </section>

      {/* ── Section 2: How to Measure ────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Instructions */}
            <div>
              <h2 className="font-serif text-3xl text-[#1a1a1a] mb-6">
                {c("sg_measure_heading", "How to Measure Your Foot")}
              </h2>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ background: "#3B5373" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#4a4a4a] leading-relaxed pt-1">
                      {/* Strip the "Step N:" prefix if present */}
                      {step.replace(/^Step\s+\d+:\s*/i, "")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right: Illustration placeholder */}
            <div
              className="rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ background: "#3B5373", minHeight: "280px" }}
            >
              <span className="text-7xl select-none">👣</span>
              <p
                className="text-sm font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Foot Measurement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Size Chart ────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#f7f7f7" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-[#1a1a1a] mb-2">
            {c("sg_chart_heading", "Heel Size Chart")}
          </h2>
          <p className="text-sm text-[#666] mb-8">
            {c("sg_chart_sub", "All measurements are in centimetres (cm)")}
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#3B5373" }}>
                  {["EU Size", "UK Size", "IN Size", "Foot Length (cm)"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold tracking-wider text-left"
                      style={{ color: "#fff" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartRows.map((row, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? "#fff" : "#f7f7f7" }}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-[#1a1a1a]">{row.eu}</td>
                    <td className="px-4 py-3 text-[#4a4a4a]">{row.uk}</td>
                    <td className="px-4 py-3 text-[#4a4a4a]">{row.in}</td>
                    <td className="px-4 py-3 text-[#4a4a4a]">{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 4: Fit Tips ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-[#1a1a1a] text-center mb-10">
            {c("sg_tips_heading", "Tips for the Perfect Fit")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon:  c("sg_tip1_icon",  "📏"),
                title: c("sg_tip1_title", "Measure in the Evening"),
                body:  c("sg_tip1_body",  "Feet tend to swell throughout the day. Measure in the evening for the most accurate size."),
              },
              {
                icon:  c("sg_tip2_icon",  "👟"),
                title: c("sg_tip2_title", "If Between Sizes"),
                body:  c("sg_tip2_body",  "We recommend sizing up. A slightly larger heel is easier to style than one that's too tight."),
              },
              {
                icon:  c("sg_tip3_icon",  "💬"),
                title: c("sg_tip3_title", "Need Help?"),
                body:  c("sg_tip3_body",  "Contact our team via WhatsApp or email — we're happy to help you find the right size."),
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 shadow-sm"
              >
                <span className="text-4xl">{icon}</span>
                <p className="font-semibold text-[#1a1a1a] text-sm">{title}</p>
                <p className="text-xs text-[#666] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA Strip ─────────────────────────────────────── */}
      <section
        className="py-14 px-4 text-center"
        style={{ background: "#3B5373" }}
      >
        <p className="text-lg font-medium mb-6" style={{ color: "rgba(255,255,255,0.9)" }}>
          {c("sg_cta_text", "Still not sure about your size?")}
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 text-sm font-semibold rounded-full transition-all hover:shadow-lg"
          style={{ background: "#fff", color: "#3B5373" }}
        >
          Chat With Us →
        </Link>
      </section>
    </>
  );
}
