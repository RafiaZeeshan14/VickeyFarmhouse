"use client";

import {
  createFadeUp,
  createScaleReveal,
  createStaggerContainer,
  easeOutExpo,
} from "@/animations";
import SwimmingPoolImage from "@/public/swimmingpool.png";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, House, Sprout, Waves } from "lucide-react";
import Header from "../Header/Header";

const features = [
  {
    Icon: Sprout,
    label: "Nature",
    subLabel: "All Around",
    color: "bg-[#3f8f51]",
  },
  {
    Icon: House,
    label: "Premium",
    subLabel: "Stay Experience",
    color: "bg-[#f49a20]",
  },
  {
    Icon: Waves,
    label: "Pool & Open",
    subLabel: "Spaces",
    color: "bg-[#2f9ad8]",
  },
];

const heroBackground = {
  backgroundImage: `url('${SwimmingPoolImage.src}')`,
};

const descriptionLines = [
  "Your perfect picnic & event destination",
  "surrounded by nature and comfort.",
];

const containerVariants = createStaggerContainer(0.16, 0.35);
const featureContainer = createStaggerContainer(0.12, 0.15);
const fadeUp = createFadeUp({ duration: 0.65, ease: easeOutExpo });
const softReveal = createScaleReveal({
  y: 18,
  duration: 0.72,
  ease: easeOutExpo,
});

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="#"
      className="scroll-mt-28 relative min-h-[820px] overflow-hidden bg-cover bg-[64%_center] pb-24 sm:min-h-[840px] md:min-h-[860px] md:bg-[62%_center] lg:min-h-[max(100vh,860px)] lg:bg-[center_42%] lg:pb-28"
      style={heroBackground}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
    >
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-[60%_center] lg:object-[center_42%]"
        autoPlay={!shouldReduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster={SwimmingPoolImage.src}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/farmVideo.mp4" type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute bottom-0 left-0 top-[140px] w-full bg-[linear-gradient(90deg,rgba(0,0,0,.38)_0%,rgba(0,0,0,.26)_45%,rgba(0,0,0,.08)_76%,transparent_100%)] sm:w-[82%] lg:w-[62%]"
        aria-hidden="true"
      />

      <Header />

      <motion.div
        className="relative z-10 mx-auto mt-20 w-[calc(100%-36px)] max-w-[590px] sm:mt-12 sm:w-[calc(100%-48px)] md:mt-14 md:max-w-[720px] lg:mt-16 lg:w-[calc(100%-64px)] lg:max-w-[1640px] xl:mt-20"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
      >
        <div className="max-w-[680px] text-center lg:max-w-[800px] lg:text-left xl:max-w-[860px]">
          <motion.div
            className="mb-5 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#9b6814] sm:text-xs lg:mb-7 lg:justify-start"
            variants={fadeUp}
          >
          </motion.div>

          <motion.p
            className="mb-3 hidden text-left font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(30px,8vw,46px)] italic leading-none text-[#d7663b] sm:text-[42px] md:text-[48px] lg:mb-3 lg:block lg:text-[46px] xl:text-[50px]"
            variants={fadeUp}
          >
            A Perfect Escape
          </motion.p>
          <motion.p
            className="text-center font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(27px,7vw,40px)] italic leading-none text-[#e2693a] sm:text-[38px] md:text-[44px] lg:hidden"
            variants={fadeUp}
          >
            A Perfect
          </motion.p>
          <motion.p
            className="mb-3 text-center font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(27px,7vw,40px)] italic leading-none text-[#e2693a] sm:text-[38px] md:text-[44px] lg:hidden"
            variants={fadeUp}
          >
            Escape
          </motion.p>

          <motion.h1
            className="m-0 text-[clamp(42px,11.5vw,60px)] font-black uppercase leading-[1.03] tracking-[-.035em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.48)] sm:text-[62px] md:text-[72px] lg:text-[clamp(64px,4.8vw,78px)] lg:leading-[.98] xl:text-[80px]"
            variants={fadeUp}
          >
            <span className="hidden whitespace-nowrap lg:block">
              Relax, Celebrate
            </span>
            <span className="hidden text-[#f2a10c] lg:block">
              &amp; Create Memories
            </span>

            <span className="block whitespace-nowrap lg:hidden">Relax</span>
            <span className="block whitespace-nowrap lg:hidden">Celebrate</span>
            <span className="hidden text-[#f2a10c] md:block lg:hidden">
              &amp; Create Memories
            </span>
            <span className="block text-[#f2a10c] md:hidden">&amp; Create</span>
            <span className="block text-[#f2a10c] md:hidden">Memories</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-[620px] text-[15px] font-medium leading-[1.55] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.65)] sm:text-[17px] md:text-[19px] lg:mx-0 lg:mt-7 lg:border-l-2 lg:border-[#d99a2b] lg:pl-5 lg:text-lg"
            variants={softReveal}
          >
            <span className="font-medium font-['Brush_Script_MT','Segoe_Script',cursive] lg:italic">
              {descriptionLines.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </span>
          </motion.p>

          <motion.div
            className="mt-10 hidden w-fit items-center overflow-hidden rounded-2xl border border-white/20 bg-[#06233a]/68 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,.2)] ring-1 ring-white/10 backdrop-blur-xl lg:flex xl:px-6"
            aria-label="Farmhouse highlights"
            variants={featureContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-5 xl:gap-6"
                variants={fadeUp}
              >
                <div className="grid grid-cols-[42px_auto] items-center gap-3 text-[11px] font-bold uppercase leading-tight tracking-[.04em] text-white xl:text-xs">
                  <span
                    className={`grid h-[42px] w-[42px] place-items-center rounded-xl text-white shadow-[0_10px_20px_rgba(6,35,58,.14)] ${feature.color}`}
                  >
                    <feature.Icon
                      className="h-5 w-5"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    {feature.label}
                    <small className="mt-1 block text-[inherit] font-semibold">
                      {feature.subLabel}
                    </small>
                  </span>
                </div>

                {index < features.length - 1 && (
                  <span
                    className="mx-5 hidden h-9 w-px bg-white/15 lg:block xl:mx-6"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mx-auto mt-8 max-w-[560px] lg:hidden"
            variants={softReveal}
          >
            <motion.div
              className="grid grid-cols-3 items-center rounded-3xl border border-white/20 bg-[#06233a]/68 px-3 py-4 shadow-[0_18px_42px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.12)] ring-1 ring-white/10 backdrop-blur-[16px] sm:px-5 sm:py-5 md:px-6"
              variants={featureContainer}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex min-w-0 items-center justify-center gap-2 px-1 text-[9px] font-semibold uppercase leading-tight text-white sm:gap-3 sm:text-[11px] md:text-xs"
                  variants={fadeUp}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-[0_10px_20px_rgba(6,35,58,.16)] sm:h-11 sm:w-11 ${feature.color}`}
                  >
                    <feature.Icon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0 text-left">
                    {feature.label}
                    <small className="mt-1 block text-[inherit] font-semibold">
                      {feature.subLabel}
                    </small>
                  </span>

                  {index < features.length - 1 ? (
                    <span
                      className="ml-auto hidden h-12 w-px bg-white/15 sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </motion.div>
              ))}
            </motion.div>

            <motion.a
              className="group mx-auto mt-6 inline-flex min-h-12 w-[min(100%,260px)] items-center justify-center gap-2.5 rounded-full bg-[#06233a] px-6 text-[12px] font-bold uppercase tracking-[.06em] text-white shadow-[0_14px_30px_rgba(6,35,58,.22)] transition-colors hover:bg-[#d99926] hover:text-[#06233a] md:min-h-[52px] md:w-[280px] md:text-sm"
              variants={fadeUp}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Explore More
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-7 hidden flex-wrap items-center gap-3 lg:flex"
            variants={fadeUp}
          >
            <motion.a
              className="group inline-flex min-h-[52px] min-w-[190px] items-center justify-center gap-3 rounded-full bg-[#06233a] px-7 text-[12px] font-bold uppercase tracking-[.08em] text-white shadow-[0_16px_34px_rgba(6,35,58,.24)] transition-colors hover:bg-[#d99926] hover:text-[#06233a]"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Explore More
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <div
        className="absolute bottom-[-1px] left-0 right-0 z-10 h-[clamp(36px,5.5vw,76px)] bg-[#fbfaf7]"
        style={{
          clipPath:
            "polygon(0 43%, 18% 59%, 35% 50%, 52% 29%, 69% 51%, 84% 38%, 100% 54%, 100% 100%, 0 100%)",
        }}
      />
    </motion.section>
  );
}
