"use client";

import { useEffect, useState } from "react";

// "Import from Google Drive" button for the admin. Opens a picker that lists
// the photos in a shared Drive folder; the chosen ones are copied to
// Cloudinary and their links are handed back through onImported.

type Photo = { id: string; name: string; mimeType: string; size: number };
type Folder = { id: string; name: string };
type Listing = { folder: { id: string; name: string; parentId: string }; folders: Folder[]; photos: Photo[] };
type Status = { drive: boolean; cloudinary: boolean; robotEmail: string };

const LAST_KEY = "classie_drive_last_folder";

export default function DriveImport({
  onImported,
  multiple = true,
  label = "Import from Google Drive",
  className = "",
}: {
  onImported: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#3B5373] text-[#3B5373] hover:bg-[#3B5373] hover:text-white transition-colors ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M8 3h8l6 10-4 7H6l-4-7z" /><path d="M8 3l6 10H2M16 3 8 17M22 13H10" /></svg>
        {label}
      </button>
      {open && <Picker multiple={multiple} onClose={() => setOpen(false)} onDone={(urls) => { setOpen(false); onImported(urls); }} />}
    </>
  );
}

function Picker({ multiple, onClose, onDone }: { multiple: boolean; onClose: () => void; onDone: (urls: string[]) => void }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [link, setLink] = useState("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/drive?status=1").then((r) => r.json()).then(setStatus).catch(() => setStatus({ drive: false, cloudinary: false, robotEmail: "" }));
    let last = "";
    try { last = localStorage.getItem(LAST_KEY) || ""; } catch { /* storage blocked */ }
    load(last, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // An empty target opens the list of all folders shared with the website.
  async function load(target: string, fallbackHome = false) {
    setLoading(true); setError(""); setPicked([]);
    try {
      const r = await fetch(`/api/admin/drive?folder=${encodeURIComponent(target.trim())}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not open this folder.");
      setListing(data);
      try { localStorage.setItem(LAST_KEY, data.folder.id); } catch { /* ignore */ }
    } catch (e) {
      if (fallbackHome && target) { setLoading(false); return load(""); }
      setListing(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : multiple ? [...p, id] : [id]));
  }

  async function importPicked() {
    const urls: string[] = [];
    const failed: string[] = [];
    setProgress({ done: 0, total: picked.length }); setError("");
    for (const id of picked) {
      try {
        const r = await fetch("/api/admin/drive", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: id }) });
        const data = await r.json();
        if (!r.ok || !data.url) throw new Error(data.error || "Upload failed");
        urls.push(data.url);
      } catch (e) {
        const name = listing?.photos.find((p) => p.id === id)?.name ?? id;
        failed.push(`${name}: ${e instanceof Error ? e.message : e}`);
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    setProgress(null);
    if (failed.length) setError(`Some photos were not imported:\n${failed.join("\n")}`);
    if (urls.length) onDone(urls);
  }

  const ready = status?.drive && status?.cloudinary;
  const busy = progress !== null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end md:items-center justify-center p-0 md:p-6" onClick={busy ? undefined : onClose}>
      <div className="bg-white w-full md:max-w-3xl max-h-[92vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-800 text-sm">Import from Google Drive</p>
            <p className="text-xs text-gray-400">Pick photos from a shared folder. They are copied to the website (Cloudinary).</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="text-gray-400 hover:text-gray-700 text-xl leading-none px-2" aria-label="Close">×</button>
        </div>

        {status && !ready ? (
          <div className="p-5 text-sm text-amber-800 bg-amber-50 m-5 rounded-xl space-y-1">
            <b>Setup not finished.</b>
            {!status.drive && <p>Add <code className="bg-amber-100 px-1 rounded">GOOGLE_SERVICE_ACCOUNT_JSON</code> in Vercel → Settings → Environment Variables.</p>}
            {!status.cloudinary && <p>Add <code className="bg-amber-100 px-1 rounded">CLOUDINARY_CLOUD_NAME</code>, <code className="bg-amber-100 px-1 rounded">CLOUDINARY_API_KEY</code> and <code className="bg-amber-100 px-1 rounded">CLOUDINARY_API_SECRET</code>.</p>}
            <p>Then redeploy.</p>
          </div>
        ) : (
          <>
            <form className="flex gap-2 px-5 pt-4" onSubmit={(e) => { e.preventDefault(); load(link); }}>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Or paste a Drive folder link"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373]"
              />
              <button type="button" disabled={loading || busy} onClick={() => { setLink(""); load(""); }}
                className="px-3 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg disabled:opacity-50 whitespace-nowrap">All folders</button>
              <button type="submit" disabled={loading || busy || !link.trim()} className="px-4 py-2 bg-[#3B5373] text-white text-xs font-semibold rounded-lg disabled:opacity-50">{loading ? "Opening…" : "Open"}</button>
            </form>
            {status?.robotEmail && (
              <p className="px-5 pt-2 text-[11px] text-gray-400 break-all">Folders must be shared (Viewer) with {status.robotEmail}</p>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[200px]">
              {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-3 whitespace-pre-line">{error}</p>}
              {listing && (
                <>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    {listing.folder.id && (
                      <button type="button" onClick={() => { setLink(listing.folder.parentId); load(listing.folder.parentId); }} className="text-xs text-[#3B5373] underline">← {listing.folder.parentId ? "Up" : "All folders"}</button>
                    )}
                    <span className="font-semibold text-gray-800">{listing.folder.name}</span>
                    {listing.folder.id && <span className="text-xs text-gray-400">{listing.photos.length} photos</span>}
                  </div>
                  {listing.folders.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {listing.folders.map((f) => (
                        <button key={f.id} type="button" onClick={() => { setLink(f.id); load(f.id); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#3B5373]">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-400" fill="currentColor"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                          {f.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {!listing.folder.id && listing.folders.length === 0 ? (
                    <p className="text-xs text-gray-500">No folders are shared with the website yet. In Google Drive, share a folder (Viewer) with {status?.robotEmail || "the website's robot email"}.</p>
                  ) : !listing.folder.id ? (
                    <p className="text-xs text-gray-400">Open a folder to see its photos.</p>
                  ) : listing.photos.length === 0 ? (
                    <p className="text-xs text-gray-400">No photos directly in this folder. Open a subfolder above.</p>
                  ) : (
                    <>
                      {multiple && (
                        <div className="flex gap-3 text-xs">
                          <button type="button" className="text-[#3B5373] underline" onClick={() => setPicked(listing.photos.map((p) => p.id))}>Select all</button>
                          {picked.length > 0 && <button type="button" className="text-gray-500 underline" onClick={() => setPicked([])}>Clear</button>}
                        </div>
                      )}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {listing.photos.map((p) => {
                          const n = picked.indexOf(p.id);
                          return (
                            <button key={p.id} type="button" onClick={() => toggle(p.id)} title={p.name}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-gray-100 ${n >= 0 ? "border-[#3B5373]" : "border-transparent"}`}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={`/api/admin/drive?thumb=${p.id}`} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                              {n >= 0 && <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#3B5373] text-white text-[10px] font-bold grid place-items-center">{multiple ? n + 1 : "✓"}</span>}
                              <span className="absolute bottom-0 inset-x-0 bg-black/45 text-white text-[9px] px-1 py-0.5 truncate">{p.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {busy ? `Importing ${progress!.done} of ${progress!.total}…` : picked.length ? `${picked.length} selected${multiple ? " · numbers show the order" : ""}` : "Tap photos to select them"}
              </p>
              <button type="button" disabled={!picked.length || busy} onClick={importPicked}
                className="px-5 py-2.5 bg-[#3B5373] text-white text-xs font-semibold rounded-xl disabled:opacity-40">
                {busy ? "Importing…" : `Import ${picked.length || ""}`.trim()}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
