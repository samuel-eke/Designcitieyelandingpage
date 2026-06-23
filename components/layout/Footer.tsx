"use client";

import { Eye, Phone, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#0c0c0c] relative overflow-hidden">

      {/* Nigerian flag stripe — top edge */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#008751]" />
        <div className="flex-1 bg-white/15" />
        <div className="flex-1 bg-[#008751]" />
      </div>

      {/* Subtle adire dot pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-adire" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1.5" fill="#FFD100" />
              <rect x="6" y="6" width="20" height="20" fill="none" stroke="#FFD100" strokeWidth="0.5" transform="rotate(45 16 16)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-adire)" />
        </svg>
      </div>

      {/* Green glow orb */}
      <div className="absolute bottom-0 left-[-10%] w-[40%] h-[60%] rounded-full bg-[#008751]/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-14 pb-8">

        {/* Top: contact + social */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-10 border-b border-white/[0.07]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-[11px] text-stone-500 uppercase tracking-widest font-semibold">Contact us</p>
            <div className="flex flex-wrap items-center gap-5">
              <a href="tel:+918010200666" className="flex items-center gap-2 text-[13px] font-semibold text-stone-300 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#008751]" />
                +91 8010200666
              </a>
              <a href="mailto:help@citieye.com" className="flex items-center gap-2 text-[13px] font-semibold text-stone-300 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#008751]" />
                help@citieye.com
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {[
              { label: "Facebook", char: "f" },
              { label: "X / Twitter", char: "𝕏" },
              { label: "LinkedIn", char: "in" },
            ].map(({ label, char }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[11px] font-bold text-stone-400 hover:border-[#FFD100]/60 hover:text-[#FFD100] transition-all"
              >
                {char}
              </a>
            ))}
          </div>
        </div>

        {/* Middle: logo + nav + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 pb-10 border-b border-white/[0.07]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Eye className="h-6 w-6 text-[#FFD100] stroke-[2.5]" />
              <span className="text-xl font-serif font-bold tracking-tight text-white group-hover:text-stone-200 transition-colors">
                CitiEye
              </span>
            </Link>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {["About", "How It Works", "Privacy Policy", "Contact Us"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest hover:text-[#FFD100] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <Link
            href="/auth?mode=signup"
            className="inline-block px-8 py-3 bg-[#008751] text-white text-[12px] font-bold tracking-widest uppercase rounded-full hover:bg-[#006633] active:scale-95 transition-all"
          >
            Register Now
          </Link>
        </div>

        {/* Bottom: legal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[11px] text-stone-600 font-light max-w-md leading-relaxed">
            A platform for citizen lifecycle management and field operations. All registrations are confidential and processed in accordance with Nigeria's Data Protection Regulation (NDPR).
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-[11px] text-stone-600 whitespace-nowrap">
            <p>&copy; {new Date().getFullYear()} CitiEye. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-stone-300 transition-colors">Cookies</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
