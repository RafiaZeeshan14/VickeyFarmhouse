"use client";

import {
  createFadeUp,
  createScaleReveal,
  createStaggerContainer,
  easeOutExpo,
} from "@/animations";
import SwimmingPoolImage from "@/public/swimmingpool.png";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Header from "../Header/Header";

const heroBackground = {
  backgroundImage: `url('${SwimmingPoolImage.src}')`,
};

const descriptionLines = [
  "Your perfect picnic & event destination",
  "surrounded by nature and comfort.",
];

const containerVariants = createStaggerContainer(0.16, 0.35);
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
        autoPlay
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
        className="relative z-10 mx-auto flex min-h-[636px] w-[calc(100%-36px)] max-w-[590px] items-center justify-center py-8 sm:min-h-[656px] sm:w-[calc(100%-48px)] md:min-h-[676px] md:max-w-[720px] lg:mt-16 lg:block lg:min-h-0 lg:w-[calc(100%-64px)] lg:max-w-[1640px] lg:py-0 xl:mt-20"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
      >
        <div className="max-w-[680px] text-center lg:max-w-[800px] lg:text-left xl:max-w-[860px]">
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
                <span key={line} className="block md:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </span>
          </motion.p>

          <motion.div
            className="mt-7 flex justify-center lg:justify-start"
            variants={fadeUp}
          >
            <motion.a
              className="group inline-flex min-h-[52px] min-w-[210px] items-center justify-center gap-3 rounded-full bg-[#06233a] px-7 text-[12px] font-bold uppercase tracking-[.08em] text-white shadow-[0_16px_34px_rgba(6,35,58,.24)] transition-colors hover:bg-[#d99926] hover:text-[#06233a] sm:text-[13px]"
              href="#aboutus"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Explore More
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
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
