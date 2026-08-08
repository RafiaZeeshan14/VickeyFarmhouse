"use client";

import {
  createFadeUp,
  createSlideReveal,
  createStaggerContainer,
  smoothEase,
} from "@/animations";
import { pricingPlans } from "@/data/pricing";
import { siteContact } from "@/lib/site";
import pricingBackground from "@/public/outdoorar.png";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ShieldCheck, UsersRound } from "lucide-react";

const headingContainer = createStaggerContainer(0.12, 0.08);
const cardsContainer = createStaggerContainer(0.14, 0.2);
const smoothReveal = createFadeUp({ distance: 22, duration: 0.75 });
const bgTextReveal = createFadeUp({ distance: 18, duration: 0.9 });
const cardReveal = createFadeUp({ distance: 30, duration: 0.82 });
const listContainer = createStaggerContainer(0.045, 0.12);
const listItemReveal = createSlideReveal({ x: -10, duration: 0.45 });

export default function Pricing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="pricing"
      className="scroll-mt-28 relative overflow-hidden bg-cover bg-center bg-fixed px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-20"
      style={{
        backgroundImage: `linear-gradient(rgb(63 57 57 / 70%), rgba(173, 173, 162, 70%)), url('${pricingBackground.src}')`,
      }}
    >
      <div className="mx-auto max-w-[1580px] rounded-xl bg-transparent py-14 sm:px-8 lg:px-10 lg:py-16">
        <motion.div
          className="relative mx-auto max-w-6xl text-center"
          variants={headingContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.p
            className="mb-2 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]"
            variants={smoothReveal}
          >
            Pricing Plans
          </motion.p>
          <motion.h2
            className="mx-auto mb-10 max-w-4xl text-[clamp(30px,6vw,52px)] font-black uppercase leading-[1.05] tracking-normal text-white/80"
            variants={smoothReveal}
          >
            Choose The Plan That
            <span className="block">
              <span className="text-[#e4a43b]">Suits</span> You
            </span>
          </motion.h2>
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[98px] mt-10 hidden -translate-x-1/2 select-none text-[clamp(128px,16vw,220px)] font-black leading-none text-white/50 lg:block"
            variants={bgTextReveal}
          >
            Pricing
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto mt-14 grid w-full max-w-[480px] justify-items-center gap-6 md:mt-20 md:max-w-none md:grid-cols-2 md:items-stretch lg:mt-40 lg:grid-cols-3 lg:gap-8 xl:gap-10"
          variants={cardsContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.16 }}
        >
          {pricingPlans.map((plan) => (
            <motion.article
              key={plan.title}
              className="relative flex h-full min-h-[520px] w-full min-w-0 flex-col rounded-[24px] border border-white/55 bg-white/48 px-5 pb-8 pt-8 text-center shadow-[0_22px_60px_rgba(6,35,58,.24),inset_0_1px_0_rgba(255,255,255,.8)] ring-1 ring-white/35 backdrop-blur-[18px] transition-shadow duration-300 hover:shadow-[0_26px_70px_rgba(6,35,58,.3),inset_0_1px_0_rgba(255,255,255,.9)] sm:px-7 md:text-left xl:px-8"
              variants={cardReveal}
              whileHover={shouldReduceMotion ? undefined : { y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <motion.div
                className="flex min-h-[96px] min-w-0 flex-col items-center justify-center gap-4 md:grid md:grid-cols-[76px_minmax(0,1fr)] md:text-left xl:gap-4"
                variants={smoothReveal}
              >
                <span
                  className={`grid h-16 w-16 place-items-center rounded-full ${plan.accentBg} ${plan.accentText}`}
                >
                  <plan.Icon
                    className="h-9 w-9"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <h3
                    className={`text-[clamp(20px,1.55vw,28px)] font-black leading-tight ${plan.accentText}`}
                  >
                    {plan.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#4b5863]">
                    {plan.description}
                  </p>
                </div>
              </motion.div>

              <div className="mt-7 h-px bg-[#06233a]/10" />
              <motion.div
                className="mt-7 flex min-h-[64px] min-w-0 flex-wrap items-end justify-center gap-x-2 gap-y-1 md:flex-nowrap md:justify-start md:whitespace-nowrap"
                variants={smoothReveal}
              >
                <span className="text-[clamp(32px,10vw,48px)] font-bold leading-none text-[#06233a] md:text-[clamp(32px,3.15vw,56px)]">
                  {plan.price}
                </span>
                <span className="shrink-0 pb-1 text-sm font-bold text-[#5e6b75]">
                  {plan.unit}
                </span>
              </motion.div>

              <motion.a
                className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border text-[13px] font-bold uppercase transition-colors ${
                  plan.button === "solid"
                    ? `border-[#e6a334] bg-[#e6a334] text-[#06233a] shadow-[0_12px_24px_rgba(230,163,52,.24)] ${plan.buttonHover}`
                    : `${plan.accentBorder} bg-white/55 ${plan.accentText} ${plan.buttonHover}`
                }`}
                href={siteContact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variants={smoothReveal}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                Book Now
              </motion.a>

              <div className="mt-7 h-px bg-[#06233a]/10" />
              <motion.div className="mt-7 text-center md:text-left" variants={listContainer}>
                <motion.div variants={listItemReveal}>
                  <p className="text-sm font-semibold leading-6 text-[#4b5863]">
                    Choose this package and book your farmhouse experience
                    instantly.
                  </p>
                </motion.div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto mt-12 grid max-w-5xl gap-5 rounded-[24px] border border-white/45 bg-white/45 p-5 text-center text-[#06233a] shadow-[0_18px_45px_rgba(6,35,58,.18)] ring-1 ring-white/35 backdrop-blur-[18px] md:grid-cols-3 md:p-6 md:text-left lg:mt-16"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: smoothEase }}
        >
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3">
            <UsersRound className="mt-1 h-5 w-5 shrink-0 text-[#e6a334]" />
            <p className="text-sm font-semibold leading-6">
              Maximum 50 persons are allowed in standard booking.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#e6a334]" />
            <p className="text-sm font-semibold leading-6">
              Security deposit is refundable after property inspection.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[#e6a334]" />
            <p className="text-sm font-semibold leading-6">
              Holidays and weekends may be charged at updated rates.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
