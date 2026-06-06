"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, MessageSquare, Send, Instagram, MapPin } from "lucide-react";
import { products } from "@/lib/products";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">Get in Touch</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">Contact Us</h1>
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* LEFT — lifestyle journal image + info */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-[#f5f5f5] aspect-[4/5] mb-8">
                <Image
                  src={products[4].image}
                  alt="Classie contact"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[11px] tracking-[0.4em] uppercase text-white/60 mb-1">We'd love to hear from you</p>
                  <h2 className="font-serif text-3xl">Say Hello 👋</h2>
                </div>
              </div>

              <div className="space-y-5">
                <ContactInfo icon={Mail} label="Email" value="hello@classie.co.in" href="mailto:hello@classie.co.in" />
                <ContactInfo icon={Phone} label="WhatsApp" value="+91 99999 99999" href="https://wa.me/919999999999" />
                <ContactInfo icon={Instagram} label="Instagram" value="@_classie_in" href="https://www.instagram.com/_classie_in/" />
                <ContactInfo icon={MapPin} label="Location" value="Mumbai, Maharashtra, India" />
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="bg-[#faf8f6] rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-classie-black mb-2">Message Sent!</h3>
                  <p className="text-classie-gray text-sm">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl text-classie-black mb-7">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <IconField icon={User} label="Your Name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Priya Sharma" required />
                    <IconField icon={Mail} label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="hello@email.com" required />
                    <IconField icon={Phone} label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />

                    <div>
                      <label className="block text-xs font-medium text-classie-gray uppercase tracking-wider mb-1.5">
                        Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute top-3.5 left-4 w-4 h-4 text-classie-gray pointer-events-none" />
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="How can we help you?"
                          className="w-full pl-11 pr-4 py-3 border border-classie-border rounded-xl text-sm focus:outline-none focus:border-[#3D4F5F] transition-colors resize-none bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-4 gap-2 disabled:opacity-60"
                    >
                      {loading ? "Sending…" : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function IconField({ icon: Icon, label, name, type, value, onChange, placeholder, required }: {
  icon: React.ElementType; label: string; name: string; type: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-classie-gray uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-classie-gray pointer-events-none" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-11 pr-4 py-3 border border-classie-border rounded-xl text-sm focus:outline-none focus:border-[#3D4F5F] transition-colors bg-white"
        />
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value, href }: {
  icon: React.ElementType; label: string; value: string; href?: string;
}) {
  const cls = "flex items-center gap-4 group";
  const inner = (
    <>
      <div className="w-10 h-10 rounded-full bg-[#3D4F5F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3D4F5F] transition-colors">
        <Icon className="w-4 h-4 text-[#3D4F5F] group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-classie-gray">{label}</p>
        <p className="text-sm font-medium text-classie-black">{value}</p>
      </div>
    </>
  );

  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
