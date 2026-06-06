import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Style Ideas",
  description: "Outfit inspiration and styling tips from Classie — heels, clip-ons and more.",
};

const looks = [
  {
    title: "The Date Night Look",
    tag: "Evening",
    desc: "Pair our Modiva heels with a satin midi dress. Add crystal clip-ons to your heels and a Gloss Bow to your clutch — instant runway.",
    image: products[7].image,
    products: ["modiva", "radiance-heart-crystal-clip-pair", "fauxbow-black"],
    color: "#3D4F5F",
  },
  {
    title: "Office to After-Hours",
    tag: "Work & Play",
    desc: "The Gloss Belle block heel pairs beautifully with tailored trousers. Swap to the Starlight Crystal Clip for your evening out — same heels, new personality.",
    image: products[5].image,
    products: ["gloss-belle", "starlight-bloom-crystal-clip-pair"],
    color: "#8b7355",
  },
  {
    title: "The Festive Glow-Up",
    tag: "Festive",
    desc: "Go bold with the Clessia Wine heel. Stack the Crystal Starburst and Radiance Crown clips for maximum shimmer at weddings, receptions and festivals.",
    image: products[0].image,
    products: ["clessia-wine", "crystal-starburst-clip-pair", "radiance-crown-crystal-clip-pair"],
    color: "#9c5b3d",
  },
  {
    title: "Everyday Effortless",
    tag: "Casual",
    desc: "Crovia block heels — your new daily staple. Add a Pearl Bloom Flower Clip for a soft, feminine touch that works from brunch to grocery run.",
    image: products[2].image,
    products: ["crovia-choclate-brown", "fauxbow-brown"],
    color: "#6b7b5f",
  },
];

export default function StyleIdeasPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">Lookbook</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">Style Ideas</h1>
        <p className="text-classie-gray text-sm mt-3 max-w-md mx-auto">
          Outfit inspiration from the Classie team — mix, match, and make it yours.
        </p>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
          {looks.map((look, i) => (
            <article key={look.title} className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "md:grid-flow-dense" : ""}`}>
              {/* Image */}
              <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f5f5] ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
                <Image src={look.image} alt={look.title} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold text-white" style={{ background: look.color }}>
                  {look.tag}
                </span>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                <p className="text-[11px] tracking-[0.4em] uppercase text-classie-gray mb-3">Look {i + 1}</p>
                <h2 className="font-serif text-3xl md:text-4xl text-classie-black mb-4">{look.title}</h2>
                <p className="text-classie-gray text-sm leading-relaxed mb-8">{look.desc}</p>

                <p className="text-xs font-semibold uppercase tracking-widest text-classie-black mb-4">Shop This Look</p>
                <div className="flex flex-col gap-3">
                  {look.products.map((slug) => {
                    const p = products.find((x) => x.slug === slug);
                    if (!p) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/products/${slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-classie-black group-hover:text-[#3D4F5F] transition-colors truncate">{p.title}</p>
                          <p className="text-xs text-classie-gray">₹{p.price.toLocaleString("en-IN")}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={`/shop/${look.products[0].includes("clip") || look.products[0].includes("bow") || look.products[0].includes("satin") || look.products[0].includes("faux") ? "clips" : "heels"}`}
                  className="btn-outline mt-8"
                >
                  Shop the Look
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#3D4F5F] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Create Your Look</h2>
          <p className="text-white/70 text-sm mb-7">Tag us @_classie_in for a chance to be featured in our next lookbook.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop/heels" className="btn-ghost-white">Shop Heels</Link>
            <Link href="/shop/clips" className="btn-ghost-white">Shop Clip-ons</Link>
          </div>
        </div>
      </section>
    </>
  );
}
