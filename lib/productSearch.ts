// Product search shared by the search overlay and the /search page.

export interface SearchItem {
  title: string;
  category: string;
  tags: string[] | null;
  description: string | null;
}

// Words people type that mean the same thing as words in our titles.
const SYNONYMS: Record<string, string[]> = {
  clip: ["clip", "charm"], clips: ["clip", "charm"], charm: ["charm", "clip"], charms: ["charm", "clip"],
  heel: ["heel", "pump", "sandal"], heels: ["heel", "pump", "sandal"], sandal: ["sandal", "heel"],
  stone: ["crystal", "rhinestone", "stone"], diamond: ["crystal", "rhinestone"], rhinestone: ["rhinestone", "crystal"],
  wedding: ["bridal", "wedding", "pearl"], bride: ["bridal", "pearl"], bridal: ["bridal", "pearl"],
  moti: ["pearl"], phool: ["flower", "floral", "bloom"], flower: ["flower", "floral", "bloom", "daisy", "sunflower"],
};

export function norm(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ");
}

export function score(it: SearchItem, words: string[]): number {
  const title = norm(it.title);
  const rest = norm(`${it.category} ${(it.tags ?? []).join(" ")} ${it.description ?? ""}`);
  let total = 0;
  for (const w of words) {
    const alts = SYNONYMS[w] ?? [w];
    let best = 0;
    for (const a of alts) {
      if (title.includes(a)) best = Math.max(best, title.split(" ").some((t) => t.startsWith(a)) ? 3 : 2);
      else if (rest.includes(a)) best = Math.max(best, 1);
    }
    if (!best) return 0;
    total += best;
  }
  return total;
}

/** Items matching the query, best first (charms before heels on a tie). */
export function searchItems<T extends SearchItem>(items: T[], q: string): T[] {
  const words = norm(q).split(" ").filter((w) => w.length > 1);
  if (!words.length) return [];
  return items
    .map((it) => ({ it, s: score(it, words) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (a.it.category === "heels" ? 1 : 0) - (b.it.category === "heels" ? 1 : 0))
    .map((x) => x.it);
}
