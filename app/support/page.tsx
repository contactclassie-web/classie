import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail, Instagram, HelpCircle, Package, RefreshCw } from "lucide-react";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">We're here to help</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">Support</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {[
            { icon: MessageCircle, label: "WhatsApp", sub: "Fastest response", href: "https://wa.me/919999999999", cta: "Chat Now", color: "#25D366" },
            { icon: Mail, label: "Email", sub: "hello@classie.co.in", href: "mailto:hello@classie.co.in", cta: "Send Email", color: "#3B5373" },
            { icon: Instagram, label: "Instagram", sub: "@_classie_in", href: "https://www.instagram.com/_classie_in/", cta: "DM Us", color: "#E1306C" },
          ].map(({ icon: Icon, label, sub, href, cta, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center text-center bg-[#faf8f6] rounded-2xl p-7 border border-classie-border hover:border-[#3B5373] transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white" style={{ background: color }}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-classie-black mb-1">{label}</p>
              <p className="text-xs text-classie-gray mb-4">{sub}</p>
              <span className="text-xs font-medium text-[#3B5373] group-hover:underline">{cta} →</span>
            </a>
          ))}
        </div>

        {/* Quick links */}
        <h2 className="font-serif text-2xl text-classie-black mb-6">Quick Help</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { icon: Package, label: "Track My Order", href: "/track-order" },
            { icon: RefreshCw, label: "Returns & Exchanges", href: "/returns" },
            { icon: HelpCircle, label: "FAQ", href: "/faq" },
          ].map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href} className="flex items-center gap-3 p-4 border border-classie-border rounded-xl hover:border-[#3B5373] hover:bg-[#faf8f6] transition-all">
              <Icon className="w-5 h-5 text-[#3B5373]" />
              <span className="text-sm font-medium text-classie-black">{label}</span>
            </Link>
          ))}
        </div>

        {/* Hours */}
        <div className="bg-[#faf8f6] rounded-2xl p-6 border border-classie-border text-center">
          <p className="font-semibold text-classie-black mb-2">Support Hours</p>
          <p className="text-sm text-classie-gray">Monday – Saturday: 10 AM – 7 PM IST</p>
          <p className="text-sm text-classie-gray">Sunday: 11 AM – 5 PM IST</p>
          <p className="text-xs text-classie-gray mt-3">We typically respond to WhatsApp messages within 1 hour during support hours.</p>
        </div>
      </div>
    </>
  );
}
