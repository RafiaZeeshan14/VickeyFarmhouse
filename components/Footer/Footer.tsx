"use client";

import Image from "next/image";
import {
  createFadeUp,
  createStaggerContainer,
  smoothEase,
} from "@/animations";
import { footerLinks, siteContact } from "@/lib/site";
import logoImage from "@/public/vlogo.png";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/",
    color: "hover:bg-[#1877f2]",
    path: "M14.2 8.6V7.1c0-.7.5-.9.8-.9h2V3h-2.8c-3.1 0-3.8 2.3-3.8 3.8v1.8H8v3.5h2.4V21h3.8v-8.9h2.6l.4-3.5h-3Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/",
    color: "hover:bg-[#e1306c]",
    path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 2.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z",
  },
  {
    label: "WhatsApp",
    href: siteContact.whatsapp,
    color: "hover:bg-[#25d366]",
    path: "M12 2a9.8 9.8 0 0 0-8.4 14.9L2.4 22l5.2-1.2A9.8 9.8 0 1 0 12 2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.7.7-3-.2-.3A8 8 0 1 1 12 19.8Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .2-1.1 0-.2-.2-.3-.4-.4Z",
  },
];

const footerContainer = createStaggerContainer(0.12, 0.12);
const fadeUp = createFadeUp();
const smallFade = createFadeUp({ distance: 14, duration: 0.55 });

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer
      id="contact"
      className="scroll-mt-28 overflow-hidden bg-[#06233a] px-4 pt-14 text-white sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto grid max-w-7xl gap-10 pb-10 lg:grid-cols-[1.15fr_0.9fr_1.3fr_1fr] lg:gap-12"
        variants={footerContainer}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={fadeUp}>
          <a
            className="relative block h-28 w-52 overflow-hidden"
            href="#home"
            aria-label="Vicky Farmhouse home"
          >
            <Image
              className="absolute left-1/2 top-1/2 h-[440px] w-[440px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
              src={logoImage}
              alt="Vicky Farmhouse"
              width={2000}
              height={2000}
            />
          </a>

          <p className="mt-4 max-w-xs text-sm font-medium leading-7 text-white/80">
            Vicky Farmhouse is your perfect getaway for picnics, parties, and
            peaceful stays surrounded by nature.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="border-white/10 lg:border-l lg:pl-12"
        >
          <h3 className="text-base font-bold uppercase">Quick Links</h3>

          <motion.nav className="mt-5 grid gap-2.5" variants={footerContainer}>
            {footerLinks.map((link) => (
              <motion.a
                key={link.label}
                variants={smallFade}
                className="text-sm font-normal text-white/85 transition-colors hover:text-[#e6a334]"
                href={link.href}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="border-white/10 lg:border-l lg:pl-12"
        >
          <h3 className="text-base font-bold uppercase">Contact Us</h3>

          <motion.div className="mt-5 grid gap-4" variants={footerContainer}>
            <motion.div
              variants={smallFade}
              className="grid grid-cols-[34px_auto] gap-3"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a334] text-[#06233a]">
                <MapPin className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="text-sm font-normal leading-6 text-white/80">
                {siteContact.address}
              </span>
            </motion.div>

            <motion.div
              variants={smallFade}
              className="grid grid-cols-[34px_auto] items-center gap-3"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a334] text-[#06233a]">
                <Phone className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <a
                className="text-sm font-normal text-white/80 transition-colors hover:text-[#e6a334]"
                href={siteContact.phoneHref}
              >
                {siteContact.phone}
              </a>
            </motion.div>

            <motion.div
              variants={smallFade}
              className="grid grid-cols-[34px_auto] items-center gap-3"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a334] text-[#06233a]">
                <Mail className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <a
                className="text-sm font-normal text-white/80 transition-colors hover:text-[#e6a334]"
                href={siteContact.emailHref}
              >
                {siteContact.email}
              </a>
            </motion.div>
          </motion.div>

          <motion.div className="mt-6 flex gap-3" variants={footerContainer}>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                variants={smallFade}
                whileHover={
                  shouldReduceMotion ? undefined : { y: -3, scale: 1.05 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white text-[#06233a] shadow-[0_10px_22px_rgba(0,0,0,.18)] transition-colors hover:text-white ${social.color}`}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path fill="currentColor" d={social.path} />
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="border-white/10 lg:border-l lg:pl-12"
        >
          <h3 className="text-base font-bold uppercase">Opening Hours</h3>

          <motion.div
            variants={smallFade}
            className="mt-8 grid grid-cols-[34px_auto] gap-3"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-[#e6a334]">
              <Clock className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <p className="text-sm font-medium leading-7 text-white/85">
              Monday - Sunday
              <span className="block">8.00 AM - 10:00 PM</span>
            </p>
          </motion.div>

          <motion.a
            variants={smallFade}
            whileHover={shouldReduceMotion ? undefined : { y: -3 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#e6a334] px-8 text-[13px] font-bold uppercase text-[#06233a] shadow-[0_12px_22px_rgba(0,0,0,.22)] transition-colors hover:bg-white"
            href={siteContact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Now
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="border-t border-white/10 py-5 text-center text-sm font-semibold text-white/58"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        © 2026 Vicky Farmhouse. All Rights Reserved.
      </motion.div>
    </footer>
  );
}
