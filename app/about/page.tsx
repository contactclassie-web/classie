import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "About Us",
  description: "The Classie story — where comfort meets luxury, designed for the modern Indian woman.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── Page header ── */}
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">Our Story</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">About Classie</h1>
      </div>

      {/* ── Two-col: heading left, text right ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-classie-black leading-tight">
                Where Comfort
                <br />
                Meets
                <br />
                <em>Elegance</em>
              </h2>
              <div className="w-12 h-1 bg-[#3D4F5F] rounded-full mt-8" />
            </div>

            {/* Right */}
            <div className="text-classie-gray leading-relaxed space-y-5 text-[15px]">
              <p>
                Classie was born from a simple belief: every woman deserves to walk with confidence,
                without sacrificing comfort. We saw a gap in the Indian market — premium-looking heels
                that actually felt good to wear — and decided to fill it.
              </p>
              <p>
                Founded by women, for women, Classie designs each pair with meticulous attention to
                detail. Our signature <strong className="text-classie-black">Classie Comfort Insole™</strong> means
                you can dance at a wedding, strut into a boardroom, or stroll through a date night —
                all in the same pair.
              </p>
              <p>
                We believe luxury shouldn't be painful. Our heels are crafted from premium vegan
                materials, thoughtfully designed to distribute weight evenly and give you the
                confidence that comes from feeling truly comfortable in your own shoes.
              </p>
              <p>
                Beyond heels, our curated accessories — satin swirls, crystal clips, gloss bows —
                are designed to transform any look, giving you a new outfit without buying a new one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-width lifestyle image ── */}
      <div className="relative h-[60vh] bg-[#2d3748] overflow-hidden">
        <Image
          src={products[7].image}
          alt="Classie lifestyle"
          fill
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
          <div>
            <p className="text-[11px] tracking-[0.5em] uppercase text-white/60 mb-3">Our promise</p>
            <h2 className="font-serif text-4xl md:text-5xl">Every Step, a Statement</h2>
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-classie-black text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Comfort First",
                body: "Every heel features our Classie Comfort Insole™ — so you look stunning without feeling the strain.",
              },
              {
                title: "Vegan & Responsible",
                body: "Premium vegan fabrics only. No animal products, no compromises on quality.",
              },
              {
                title: "Made for India",
                body: "Designed for Indian widths, Indian occasions, and Indian weather. Heels that fit your life.",
              },
              {
                title: "Accessible Luxury",
                body: "Premium design without the premium price tag. Because confidence shouldn't have a credit limit.",
              },
              {
                title: "Easy Returns",
                body: "7-day hassle-free returns and exchanges. We want you to love what you ordered.",
              },
              {
                title: "Community-Driven",
                body: "Built by women, for women. Our community's feedback shapes every new design we launch.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-[#faf8f6] rounded-2xl p-6">
                <h3 className="font-serif text-xl text-classie-black mb-3">{v.title}</h3>
                <p className="text-sm text-classie-gray leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-[#3D4F5F] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-4xl mb-4">Ready to Step In?</h2>
          <p className="text-white/70 text-sm mb-8">
            Discover the Classie collection — heels and accessories for every occasion.
          </p>
          <Link href="/shop/heels" className="btn-ghost-white">Shop Now</Link>
        </div>
      </section>
    </>
  );
}
