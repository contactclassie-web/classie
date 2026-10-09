import type { PolicyPage } from "@/lib/siteContent";

// Privacy / Terms / Refund pages. Text is edited in Admin → Menu, FAQ & Legal.
export default function PolicyView({ page }: { page: PolicyPage }) {
  const sections = (page.sections ?? []).filter((s) => s.title?.trim() || s.body?.trim());
  return (
    <>
      <div className="bg-[#faf8f6] py-12 px-4 text-center border-b border-classie-border">
        <h1 className="font-serif text-4xl md:text-5xl text-classie-black">{page.title}</h1>
        {page.updated && <p className="text-classie-gray text-sm mt-3">Last updated: {page.updated}</p>}
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-14 text-sm text-classie-gray leading-relaxed space-y-8">
        {sections.map((s, i) => (
          <div key={i}>
            {s.title && <h2 className="font-serif text-2xl text-classie-black mb-3">{s.title}</h2>}
            {s.body.split(/\n\s*\n/).map((para, j) => (
              <p key={j} className="whitespace-pre-line mt-2 first:mt-0">{para}</p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
