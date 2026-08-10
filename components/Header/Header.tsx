"use client";

import { navigationLinks, siteContact } from "@/lib/site";
import logoImage from "@/public/vlogo.png";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="relative z-20 mx-auto flex min-h-[88px] w-[calc(100%-24px)] items-start justify-between gap-2 pt-4 sm:w-[calc(100%-36px)] md:min-h-[96px] lg:min-h-28 lg:w-[min(1640px,calc(100%-64px))] lg:items-center lg:gap-4 lg:pt-0"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
    >
      <motion.a
        className="relative block h-[74px] w-[132px] shrink-0 overflow-hidden sm:h-[82px] sm:w-[150px] md:h-[92px] md:w-[170px] lg:h-[104px] lg:w-[190px]"
        href="#"
        aria-label="Vicky Farmhouse home"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        <Image
          className="absolute left-1/2 top-[54%] h-[270px] w-[270px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain sm:h-[300px] sm:w-[300px] md:h-[335px] md:w-[335px] lg:h-[380px] lg:w-[380px]"
          src={logoImage}
          alt="Vicky Farmhouse"
          width={2000}
          height={2000}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 335px, (min-width: 640px) 300px, 270px"
          priority
        />
      </motion.a>

      <motion.div
        className="ml-auto mt-4 flex items-center gap-2 lg:hidden"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        <motion.button
          className="inline-grid h-10 w-10 place-items-center rounded-full bg-white/80 text-[#e6a334] shadow-[0_10px_24px_rgba(6,35,58,.14)] ring-1 ring-[#e6a334]/20 backdrop-blur transition-colors hover:bg-[#e6a334] hover:text-white"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.04 }}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          )}
        </motion.button>

        <motion.a
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#06233a] px-4 text-[11px] font-bold uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] transition-colors hover:bg-[#e6a334] hover:text-[#06233a] sm:px-5"
          href={siteContact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Book Now
        </motion.a>
      </motion.div>

      <nav
        className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-10"
        aria-label="Primary navigation"
      >
        {navigationLinks.map((item, index) => (
          <motion.a
            key={item.label}
            className={`relative py-2.5 text-[11px] font-semibold uppercase tracking-normal transition-colors hover:text-[#e6a334] xl:text-sm ${
              item.label === "Home"
                ? "text-[#e99c1c] after:absolute after:bottom-px after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-[#e9a52a]"
                : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,.45)]"
            }`}
            href={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.55 + index * 0.07,
              ease: "easeOut",
            }}
            whileHover={{ y: -2 }}
          >
            {item.label}
          </motion.a>
        ))}
      </nav>

      <motion.a
        className="mt-[13px] hidden min-h-[42px] items-center justify-center gap-2.5 rounded-full bg-[#06233a] px-3.5 text-[11px] font-semibold uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] transition-colors hover:bg-[#e2a13a] hover:text-[#06233a] sm:px-5 lg:mt-0 lg:inline-flex lg:min-h-12 lg:px-7 lg:text-[13px]"
        href="#"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <CalendarCheck className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
        Book Now
      </motion.a>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-[28px] bg-white/95 shadow-[0_24px_60px_rgba(6,35,58,.18)] ring-1 ring-[#06233a]/10 backdrop-blur lg:hidden"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <nav className="grid gap-1 p-4" aria-label="Mobile navigation">
              {navigationLinks.map((item, index) => (
                <motion.a
                  key={item.label}
                  className={`rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-normal transition-colors hover:bg-[#fff5e1] hover:text-[#e6a334] ${
                    item.label === "Home"
                      ? "bg-[#fff5e1] text-[#e99c1c]"
                      : "text-[#09293e]"
                  }`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.035 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
