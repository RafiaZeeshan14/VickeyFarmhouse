"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Facilities", href: "#facilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-20 mx-auto flex min-h-[88px] w-[calc(100%-24px)] items-start justify-between gap-2 pt-4 sm:w-[calc(100%-36px)] md:min-h-[96px] lg:min-h-28 lg:w-[min(1640px,calc(100%-64px))] lg:items-center lg:gap-4 lg:pt-0">
      <a
        className="relative block h-[74px] w-[132px] shrink-0 overflow-hidden sm:h-[82px] sm:w-[150px] md:h-[92px] md:w-[170px] lg:h-[104px] lg:w-[190px]"
        href="#"
        aria-label="Vicky Farmhouse home"
      >
        <Image
          className="absolute left-1/2 top-[60%] h-[330px] w-[330px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain sm:h-[380px] sm:w-[380px] md:h-[430px] md:w-[430px] lg:top-[62%] lg:h-[480px] lg:w-[480px]"
          src="/vlogo.png"
          alt="Vicky Farmhouse"
          width={2000}
          height={2000}
          priority
        />
      </a>

      <div className="ml-auto mt-4 flex items-center gap-2 lg:hidden">
        <button
          className="inline-grid h-10 w-10 place-items-center rounded-full bg-white/80 text-[#e6a334] shadow-[0_10px_24px_rgba(6,35,58,.14)] ring-1 ring-[#e6a334]/20 backdrop-blur transition-colors hover:bg-[#e6a334] hover:text-white"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          )}
        </button>

        <a
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#06233a] px-4 text-[11px] font-bold uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] transition-colors hover:bg-[#e6a334] hover:text-[#06233a] sm:px-5"
          href="#"
        >
          Book Now
        </a>
      </div>

      <nav
        className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-10"
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`relative py-2.5 text-[11px] font-semibold uppercase tracking-normal transition-colors hover:text-[#e6a334] xl:text-sm ${
              item.label === "Home"
                ? "text-[#e99c1c] after:absolute after:bottom-px after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-[#e9a52a]"
                : "text-[#09293e]"
            }`}
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="mt-[13px] hidden min-h-[42px] items-center justify-center gap-2.5 rounded-full bg-[#06233a] px-3.5 text-[11px] font-semibold uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] transition-colors hover:bg-[#e2a13a] hover:text-[#06233a] sm:px-5 lg:mt-0 lg:inline-flex lg:min-h-12 lg:px-7 lg:text-[13px]"
        href="#"
      >
        <CalendarCheck className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
        Book Now
      </a>

      <div
        id="mobile-navigation"
        className={`absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-[28px] bg-white/95 shadow-[0_24px_60px_rgba(6,35,58,.18)] ring-1 ring-[#06233a]/10 backdrop-blur transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-[520px] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="grid gap-1 p-4" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              className={`rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-normal transition-colors hover:bg-[#fff5e1] hover:text-[#e6a334] ${
                item.label === "Home"
                  ? "bg-[#fff5e1] text-[#e99c1c]"
                  : "text-[#09293e]"
              }`}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#06233a] px-6 text-sm font-bold uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] transition-colors hover:bg-[#e6a334] hover:text-[#06233a]"
            href="#"
            onClick={() => setIsMenuOpen(false)}
          >
            <CalendarCheck
              className="h-4 w-4"
              strokeWidth={2.4}
              aria-hidden="true"
            />
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
