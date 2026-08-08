"use client";

import {
  createFadeUp,
  createScaleReveal,
  createStaggerContainer,
  easeOutExpo,
} from "@/animations";
import { motion, useReducedMotion } from "framer-motion";
import { House, Sprout, Waves } from "lucide-react";
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
  backgroundImage:
    "linear-gradient(90deg, rgba(255,255,255,.86) 0%, rgba(255,255,255,.68) 30%, rgba(255,255,255,.24) 54%, rgba(255,255,255,.04) 78%, rgba(255,255,255,0) 100%), linear-gradient(180deg, rgba(255,255,255,.76) 0%, rgba(255,255,255,.24) 22%, rgba(255,255,255,0) 48%), url('/hero.png')",
};

const descriptionText =
  "Your perfect picnic & event destination surrounded by nature and comfort.";

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
      className="scroll-mt-28 relative min-h-[820px] overflow-hidden bg-cover bg-[68%_center] pb-24 sm:min-h-[840px] md:min-h-[860px] md:bg-[66%_center] lg:min-h-[max(100vh,900px)] lg:bg-center lg:pb-28"
      style={heroBackground}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_48%,rgba(255,255,255,.9)_0%,rgba(255,255,255,.66)_28%,rgba(255,255,255,.26)_48%,rgba(255,255,255,0)_72%)] sm:bg-[radial-gradient(ellipse_at_16%_48%,rgba(255,255,255,.9)_0%,rgba(255,255,255,.68)_30%,rgba(255,255,255,.28)_50%,rgba(255,255,255,0)_74%)] lg:bg-[radial-gradient(ellipse_at_19%_46%,rgba(255,255,255,.86)_0%,rgba(255,255,255,.62)_27%,rgba(255,255,255,.32)_44%,rgba(255,255,255,.08)_64%,rgba(255,255,255,0)_78%)] xl:bg-[radial-gradient(ellipse_at_19%_46%,rgba(255,255,255,.84)_0%,rgba(255,255,255,.58)_27%,rgba(255,255,255,.3)_44%,rgba(255,255,255,.08)_64%,rgba(255,255,255,0)_78%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.35 }}
      />

      <Header />

      <motion.div
        className="relative z-10 mx-auto mt-20 w-[calc(100%-36px)] max-w-[590px] sm:mt-8 sm:w-[calc(100%-48px)] md:mt-10 md:max-w-[720px] lg:mt-20 lg:w-[calc(100%-64px)] lg:max-w-none xl:mt-24 xl:w-[calc(100%-176px)] 2xl:mt-28 2xl:w-[min(1860px,calc(100%-192px))]"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
      >
        <div className="max-w-[680px] lg:max-w-[980px] xl:max-w-[1060px] 2xl:max-w-[1120px]">
          <motion.p
            className="hidden lg:block mb-3 text-left font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(30px,8vw,46px)] italic leading-none text-[#e2693a] sm:text-[42px] md:text-[48px] lg:mb-2 lg:text-[50px] xl:text-[54px]"
            variants={fadeUp}
          >
            A Perfect Escape
          </motion.p>
<motion.p
            className="lg:hidden  text-left font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(30px,8vw,46px)] italic leading-none text-[#e2693a] sm:text-[42px] md:text-[48px] lg:mb-2 lg:text-[50px] xl:text-[54px]"
            variants={fadeUp}
          >
            A Perfect 
          </motion.p>
          <motion.p
            className="lg:hidden mb-3 text-left font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(30px,8vw,46px)] italic leading-none text-[#e2693a] sm:text-[42px] md:text-[48px] lg:mb-2 lg:text-[50px] xl:text-[54px]"
            variants={fadeUp}
          >
           Escape
          </motion.p>


          <motion.h1
            className="m-0 text-[clamp(31px,8.7vw,50px)] font-black uppercase leading-[1.05] tracking-normal text-[#06233a] sm:text-[50px] md:text-[64px] lg:text-[clamp(70px,5.8vw,86px)] lg:leading-[.98] xl:text-[clamp(76px,4.25vw,86px)]"
            variants={fadeUp}
          >
            <span className="hidden whitespace-nowrap lg:block">
              Relax, Celebrate
            </span>
            <span className="hidden text-[#f2a10c] lg:block">
              & Create Memories
            </span>

            <span className="block whitespace-nowrap lg:hidden">Relax</span>
            <span className="block whitespace-nowrap lg:hidden">Celebrate</span>
            <span className="hidden text-[#f2a10c] md:block lg:hidden">
              & Create Memories
            </span>
            <span className="block text-[#f2a10c] md:hidden">& Create</span>
            <span className="block text-[#f2a10c] md:hidden">Memories</span>
          </motion.h1>

          <motion.p
            className="mt-5 flex max-w-[400px] items-start gap-3 rounded-[22px] border border-white/70 bg-white/55 p-4 text-[14px] font-medium leading-[1.5] text-[#17334a] shadow-[0_14px_34px_rgba(6,35,58,.13),inset_0_1px_0_rgba(255,255,255,.85)] ring-1 ring-white/35 backdrop-blur-[16px] sm:max-w-[500px] sm:gap-3.5 sm:rounded-[24px] sm:p-5 sm:text-[15px] md:max-w-[540px] md:text-[17px] lg:mt-8 lg:flex lg:max-w-[700px] lg:items-start lg:gap-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-[clamp(15px,1.4vw,18px)] lg:font-semibold lg:shadow-none lg:ring-0 lg:backdrop-blur-0 xl:mt-9 xl:text-lg"
            variants={softReveal}
          >
            <span className="font-medium font-['Brush_Script_MT','Segoe_Script',cursive] lg:italic">
              {descriptionText}
            </span>
          </motion.p>

          <motion.div
            className="mt-8 hidden flex-wrap items-center gap-x-8 gap-y-5 lg:mt-14 lg:flex xl:mt-16 xl:gap-x-12"
            aria-label="Farmhouse highlights"
            variants={featureContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-8 xl:gap-12"
                variants={fadeUp}
              >
                <div className="grid grid-cols-[38px_auto] items-center gap-3 text-[12px] font-semibold uppercase leading-tight text-[#08263c] sm:grid-cols-[50px_auto] sm:gap-3.5 sm:text-[13px] xl:text-[15px]">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-white shadow-[0_10px_20px_rgba(6,35,58,.16)] sm:h-[50px] sm:w-[50px] ${feature.color}`}
                  >
                    <feature.Icon
                      className="h-5 w-5 sm:h-7 sm:w-7"
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
                    className="hidden h-10 w-px bg-[#06233a]/20 lg:block"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 max-w-[560px] lg:hidden"
            variants={softReveal}
          >
            <motion.div
              className="grid grid-cols-3 items-center rounded-3xl border border-white/65 bg-white/55 px-3 py-4 shadow-[0_18px_42px_rgba(6,35,58,.14),inset_0_1px_0_rgba(255,255,255,.82)] ring-1 ring-white/35 backdrop-blur-[16px] sm:px-5 sm:py-5 md:px-6"
              variants={featureContainer}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex min-w-0 items-center justify-center gap-2 px-1 text-[9px] font-semibold uppercase leading-tight text-[#08263c] sm:gap-3 sm:text-[11px] md:text-xs"
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
                      className="ml-auto hidden h-12 w-px bg-[#06233a]/12 sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </motion.div>
              ))}
            </motion.div>

            <motion.a 
              className="mx-auto mt-6 inline-flex min-h-12 w-[min(100%,260px)] items-center justify-center gap-2 rounded-full border-2 border-[#e6a3346b] bg-white/60 px-6 text-[12px] font-bold uppercase text-[#e6a334] shadow-[0_14px_30px_rgba(6,35,58,.12),inset_0_0_0_1px_rgba(255,255,255,.72)] backdrop-blur-[10px] transition-colors hover:border-[#e6a334] hover:bg-[#e6a334] hover:text-[#06233a] md:min-h-[52px] md:w-[280px] md:text-sm"
              variants={fadeUp}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Explore More
              <span aria-hidden="true">&gt;</span>
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-6 hidden flex-wrap items-center gap-3 sm:mt-7 sm:gap-4 lg:mt-12 lg:flex xl:mt-14 xl:gap-6"
            variants={fadeUp}
          >
            <motion.a 
              className="inline-flex min-h-11 w-[calc(50%-6px)] min-w-[160px] items-center justify-center gap-2 rounded-full border-2 border-[#e6a3346b] bg-white/60 px-4 text-[12px] font-bold uppercase text-[#e6a334] shadow-[inset_0_0_0_1px_rgba(255,255,255,.72)] transition-colors hover:border-[#e6a334] hover:bg-[#e6a334] hover:text-[#06233a] sm:w-auto sm:min-w-[218px] sm:gap-2.5 sm:px-7 sm:text-[13px] lg:min-h-12"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Explore More
              <span aria-hidden="true">&gt;</span>
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