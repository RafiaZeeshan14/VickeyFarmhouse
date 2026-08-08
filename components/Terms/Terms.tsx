"use client";

import { createFadeUp, createStaggerContainer } from "@/animations";
import { farmhouseTerms } from "@/data/terms";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = createStaggerContainer(0.09, 0.15);
const fadeUp = createFadeUp({ distance: 26 });

export default function TermsConditions() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="terms" className="scroll-mt-28 relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#e6a334]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[#2f9ad8]/12 blur-3xl" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#fffaf0_48%,#eef7ff_100%)] px-6 py-12 shadow-[0_30px_90px_rgba(6,35,58,.13)] sm:px-8 lg:px-12 lg:py-16 xl:max-w-[1600px]"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="pointer-events-none absolute right-10 top-10 hidden text-[120px] font-black uppercase leading-none text-[#06233a]/[0.04] lg:block xl:text-[160px]">
          Rules
        </div>

        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={fadeUp}
        >
          <p className="mb-3 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(30px,6vw,46px)] italic leading-none text-[#e4a43b]">
            Terms & Conditions
          </p>

          <h2 className="text-[clamp(34px,6vw,68px)] font-black uppercase leading-[.98] tracking-tight text-[#06233a]">
            Please Read Before
            <span className="block">
              Your <span className="text-[#e6a334]">Visit</span>
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-[16px] font-medium leading-8 text-[#294258] sm:text-lg">
            To ensure a safe, comfortable, and enjoyable experience for
            everyone, guests are requested to follow these farmhouse policies.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6"
          variants={containerVariants}
        >
          {farmhouseTerms.map(({ Icon, title, description }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              className="group relative overflow-hidden rounded-[24px] border border-white/70 bg-white/70 p-6 text-left shadow-[0_18px_42px_rgba(6,35,58,.10)] ring-1 ring-[#06233a]/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_24px_58px_rgba(6,35,58,.16)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e6a334]/10 transition duration-300 group-hover:scale-125" />

              <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[#06233a] text-[#e6a334] shadow-[0_12px_26px_rgba(6,35,58,.18)]">
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </span>

              <h3 className="mt-5 text-[17px] font-black uppercase leading-tight text-[#06233a]">
                {title}
              </h3>

              <p className="mt-3 text-sm font-medium leading-6 text-[#4b5863]">
                {description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 rounded-[24px] shadow-[0_22px_60px_rgba(6,35,58,.24),inset_0_1px_0_rgba(255,255,255,.8)] ring-1 ring-white/35 backdrop-blur-[18px] transition-shadow border backdrop-blur-md border-[#e6a334]/25  p-6 text-center text-white shadow-[0_18px_40px_rgba(6,35,58,.18)] sm:p-7"
          variants={fadeUp}
        >
          <p className="text-sm font-medium leading-7 text-black">
            By confirming your booking, you agree to follow all farmhouse rules
            and cooperate with the management.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
