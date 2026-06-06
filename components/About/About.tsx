"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Bed, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const aboutFeatures = [
  {
    Icon: Sparkles,
    title: "Spacious",
    subtitle: "Outdoor Areas",
  },
  {
    Icon: Bed,
    title: "Comfortable",
    subtitle: "Stay Options",
  },
  {
    Icon: ShieldCheck,
    title: "Hygienic",
    subtitle: "& Clean",
  },
  {
    Icon: UsersRound,
    title: "Events & Party",
    subtitle: "Friendly",
  },
];

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.18,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

const imageFloatLeft: Variants = {
  hidden: { opacity: 0, x: -36, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
};

const imageFloatRight: Variants = {
  hidden: { opacity: 0, x: 36, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
};

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="aboutus"
      className="scroll-mt-28 relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-24 xl:py-28"
    >
      <div className="pointer-events-none absolute -top-12 left-0 right-0 h-20 bg-[#fbfaf7]" />

      {/* Premium Gradient Glow */}
      <div className="pointer-events-none absolute -right-28 top-10 h-96 w-96 rounded-full bg-[#e6a334]/18 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-10 h-96 w-96 rounded-full bg-[#e6a334]/16 blur-3xl" />

      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20 xl:max-w-7xl xl:grid-cols-[1.08fr_1fr] xl:gap-24"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[430px] xl:h-[500px] xl:max-w-[620px]"
          variants={fadeUp}
        >
          <motion.div
            className="absolute left-2 top-16 grid grid-cols-7 gap-2 opacity-50 sm:left-0 sm:top-20"
            variants={fadeUp}
          >
            {Array.from({ length: 42 }).map((_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-[#6b747c]"
              />
            ))}
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-0 h-48 w-24 rounded-full bg-[#f6a313] blur-[1px] sm:bottom-8 sm:left-4"
            variants={fadeUp}
          />

          <motion.div
            className="absolute bottom-2 left-4 h-28 w-28 -rotate-45 rounded-tl-[90px] bg-[#f6a313]"
            variants={fadeUp}
          />

          <motion.div
            className="absolute bottom-0 left-2 h-28 w-36 origin-bottom-left rotate-[-24deg] bg-[#06233a] [clip-path:polygon(0_75%,100%_0,78%_100%,0_100%)]"
            variants={fadeUp}
          />

          <motion.div
            className="absolute left-[20%] top-4 w-[68%] rotate-[-4deg] rounded-md bg-white p-2 shadow-[0_10px_18px_rgba(6,35,58,.22)] sm:left-[18%] sm:w-[70%] xl:left-[15%] xl:w-[76%] xl:p-2.5"
            variants={imageFloatLeft}
            whileHover={
              shouldReduceMotion ? undefined : { y: -5, rotate: -5 }
            }
          >
            <div className="h-36 overflow-hidden rounded bg-[#d7e6d6] sm:h-44 xl:h-52">
              <img
                className="h-full w-full object-cover object-[50%_28%]"
                src="/hero.png"
                alt="Green farmhouse garden pathway"
              />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-6 left-[28%] w-[68%] rotate-[4deg] rounded-md bg-white p-2 shadow-[0_12px_20px_rgba(6,35,58,.24)] sm:bottom-8 sm:left-[25%] sm:w-[72%] xl:left-[21%] xl:w-[78%] xl:p-2.5"
            variants={imageFloatRight}
            whileHover={
              shouldReduceMotion ? undefined : { y: -5, rotate: 5 }
            }
          >
            <div className="h-40 overflow-hidden rounded bg-[#d7e6d6] sm:h-52 xl:h-60">
              <img
                className="h-full w-full object-cover object-[75%_58%]"
                src="/hero.png"
                alt="Farmhouse lawn with poolside seating"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:text-left xl:max-w-2xl"
          variants={containerVariants}
        >
          <motion.p
            className="mb-3 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(35px,6vw,42px)] italic leading-none text-[#e4a43b] xl:text-5xl"
            variants={fadeUp}
          >
            About Us
          </motion.p>

          <motion.h2
            className="text-[clamp(32px,7vw,52px)] font-black uppercase leading-[1.02] tracking-normal text-[#06233a] xl:text-[58px]"
            variants={fadeUp}
          >
            Welcome To
            <span className="block">
              <span className="text-[#f2a10c]">Vicky</span> Farmhouse
            </span>
          </motion.h2>

          <motion.p
            className="mt-5 text-[15px] font-semibold leading-7 text-[#4b5863] sm:text-base xl:text-[17px] xl:leading-8"
            variants={fadeUp}
          >
            Vicky Farmhouse is the ideal getaway for family picnics, weekend
            outings, birthday parties, corporate events, and more.
          </motion.p>

          <motion.p
            className="mt-2 text-[15px] font-semibold leading-7 text-[#4b5863] sm:text-base xl:text-[17px] xl:leading-8"
            variants={fadeUp}
          >
            Spread across lush greenery with modern amenities, we ensure a
            perfect blend of nature, comfort, and fun.
          </motion.p>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 xl:mt-10 xl:gap-x-6"
            variants={containerVariants}
          >
            {aboutFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                className="flex items-center gap-3 text-left text-[#06233a]"
                variants={fadeUp}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#06233a] shadow-[0_8px_18px_rgba(6,35,58,.12)] ring-1 ring-[#06233a]/10">
                  <feature.Icon
                    className="h-5 w-5"
                    strokeWidth={2.35}
                    aria-hidden="true"
                  />
                </span>

                <span className="text-[11px] font-semibold leading-tight">
                  {feature.title}
                  <small className="block text-[10px] font-medium text-[#536271]">
                    {feature.subtitle}
                  </small>
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-[#062b45] [clip-path:polygon(0_70%,36%_70%,52%_10%,68%_70%,100%_38%,100%_100%,0_100%)]" />
    </section>
  );
}
