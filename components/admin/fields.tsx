"use client";

// Small form building blocks shared by the admin page builders.

export const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373] bg-white";
export const labelCls = "block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1";
export const btnSm = "px-2.5 py-1 text-xs border border-gray-200 rounded-md hover:border-[#3B5373] hover:text-[#3B5373] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit";


export function Field({ label, value, onChange, placeholder, area, hint, type = "text" }: {
  label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; area?: boolean; hint?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {area
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={inputCls} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />}
      {hint && <span className="block text-[11px] text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

export function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

export function MediaField({ label, value, onChange, hint, video }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; video?: boolean;
}) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-3 items-start">
      <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-[10px] text-gray-400">
        {value
          ? (video || isVideo(value)
            ? <video src={value} muted playsInline className="w-full h-full object-cover" />
            // eslint-disable-next-line @next/next/no-img-element
            : <img src={value} alt="" className="w-full h-full object-cover" />)
          : "Empty"}
      </div>
      <Field label={label} value={value} onChange={onChange} placeholder="https://res.cloudinary.com/…" hint={hint} />
    </div>
  );
}

export function Panel({ title, children, open, note }: { title: string; children: React.ReactNode; open?: boolean; note?: string }) {
  return (
    <details open={open} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
      <summary className="list-none cursor-pointer px-6 py-4 flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-700">{title}</span>
        <span className="flex items-center gap-3">
          {note && <span className="text-xs text-gray-400 hidden sm:inline">{note}</span>}
          <span className="text-gray-400 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
        </span>
      </summary>
      <div className="px-6 pb-6 space-y-4 border-t border-gray-50 pt-4">{children}</div>
    </details>
  );
}

export function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

