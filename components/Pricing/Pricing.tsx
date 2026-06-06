"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Clock,
  Moon,
  ShieldCheck,
  SunMedium,
  UsersRound,
} from "lucide-react";

const plans = [
  {
    Icon: SunMedium,
    title: "Day Outing",
    description: "12 Hours Day Experience",
    price: "RS 45,000",
    unit: "/ Day",
    timing: "09:00 AM - 06:00 PM",
    poolTiming: "10:00 AM - 04:00 PM",
    accentText: "text-[#5f9270]",
    accentBg: "bg-[#eaf2eb]",
    accentBorder: "border-[#5f9270]",
    checkBg: "bg-[#5f9270]",
    buttonHover: "hover:border-[#5f9270] hover:bg-[#5f9270] hover:text-white",
    button: "outline",
    notes: [
      "Maximum 50 persons allowed",
      "Extra person: Rs. 1,000 per head",
      "50% advance required for booking",
      "Security deposit: Rs. 10,000 refundable",
    ],
  },
  {
    Icon: Moon,
    title: "Weekend Stay",
    description: "20 Hours Complete Experience",
    price: "RS 95,000",
    unit: "/ Weekend",
    timing: "Saturday Night - Sunday Night",
    poolTiming: "24 Hours Pool Access",
    accentText: "text-[#e6a334]",
    accentBg: "bg-[#fff4df]",
    accentBorder: "border-[#e6a334]",
    checkBg: "bg-[#e6a334]",
    buttonHover:
      "hover:border-[#e6a334] hover:bg-[#e6a334] hover:text-[#06233a]",
    button: "solid",
    popular: true,
        notes: [
      "Weekend & holiday rates may apply",
      "Cold drinks available at canteen ",
      "Outside cold drinks not allowed",
      "Rates may change without prior notice",
    ],
  
  },
  {
    Icon: CalendarDays,
    title: " Night",
    description: "12 Hours Complete Experience",
    price: "RS 85,000",
    unit: "/ 12 Hours",
    timing: "08:00 PM - 04:00 PM",
    poolTiming: "10:00 PM - 04:00 PM",
    accentText: "text-[#3f78b2]",
    accentBg: "bg-[#eaf2fb]",
    accentBorder: "border-[#3f78b2]",
    checkBg: "bg-[#3f78b2]",
    buttonHover: "hover:border-[#3f78b2] hover:bg-[#3f78b2] hover:text-white",
    button: "outline",
  notes: [
      "Maximum 50 persons allowed",
      "Extra person: Rs. 1,000 per head",
      "Balance 7 days before booking",
      "Misuse may result in immediate vacation",
    ],
  },
];

const smoothEase = [0.25, 1, 0.5, 1] as const;

const headingContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardsContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const smoothReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: smoothEase,
    },
  },
};

const bgTextReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: smoothEase,
    },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.82,
      ease: smoothEase,
    },
  },
};

const listContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.12,
    },
  },
};

const listItemReveal: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: smoothEase,
    },
  },
};

export default function Pricing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="pricing"
      className="scroll-mt-28 relative overflow-hidden bg-cover bg-center bg-fixed px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgb(63 57 57 / 70%), rgba(173, 173, 162, 70%)), url(/villa6.jpg)",
      }}
    >
      <div className="mx-auto max-w-[1580px] rounded-xl bg-transparent px-4 py-14 sm:px-8 lg:px-10 lg:py-16">
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
          className="relative z-10 mt-20 grid items-stretch gap-6 lg:grid-cols-3 lg:mt-40 lg:gap-8 xl:gap-10"
          variants={cardsContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.16 }}
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.title}
              className={`relative flex min-h-[760px] w-full flex-col rounded-[24px] border bg-white/48 px-7 pb-8 pt-8 text-left shadow-[0_22px_60px_rgba(6,35,58,.24),inset_0_1px_0_rgba(255,255,255,.8)] ring-1 ring-white/35 backdrop-blur-[18px] transition-shadow duration-300 hover:shadow-[0_26px_70px_rgba(6,35,58,.3),inset_0_1px_0_rgba(255,255,255,.9)] xl:px-8 ${
                plan.popular
                  ? "border-[#e6a334] md:-translate-y-6 lg:scale-[1.03]"
                  : "border-white/55"
              }`}
              variants={cardReveal}
              whileHover={shouldReduceMotion ? undefined : { y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {plan.popular ? (
                <>
                  {/* <div className="absolute inset-x-0 top-0 h-[3px] bg-[#e6a334]" /> */}

                  <div className="absolute left-1/2 top-0 flex min-h-[58px] min-w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-b-[28px] rounded-t-none bg-[#e6a334] px-8 py-2 text-center shadow-[0_14px_30px_rgba(230,163,52,.35)]">
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
                      Most Popular
                    </span>

                  </div>
                </>
              ) : null}

              <motion.div
                className="grid min-h-[96px] grid-cols-[76px_auto] items-center gap-4"
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

                <div>
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
                className="mt-7 flex min-h-[64px] items-end gap-2 whitespace-nowrap"
                variants={smoothReveal}
              >
                <span className="text-[clamp(32px,3.15vw,56px)] font-bold leading-none text-[#06233a]">
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
                href="https://wa.me/923712108053?text=Hello%20I%20want%20to%20book%20Vicky%20Farmhouse"
                target="_blank"
                rel="noopener noreferrer"
                variants={smoothReveal}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                Book Now
              </motion.a>

              <div className="mt-7 h-px bg-[#06233a]/10" />

              <motion.div className="mt-7 space-y-5" variants={listContainer}>
                <motion.div
                  variants={listItemReveal}
                  className="rounded-2xl bg-white/50 p-4 ring-1 ring-[#06233a]/8"
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${plan.accentText}`} />
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5e6b75]">
                      Farmhouse Timing
                    </p>
                  </div>
                  <p className="mt-2 text-lg font-bold text-[#06233a]">
                    {plan.timing}
                  </p>
                </motion.div>

                <motion.div
                  variants={listItemReveal}
                  className="rounded-2xl bg-white/50 p-4 ring-1 ring-[#06233a]/8"
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${plan.accentText}`} />
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5e6b75]">
                      Pool Timing
                    </p>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-[#06233a]">
                    {plan.poolTiming}
                  </p>
                </motion.div>

                <div className="h-px bg-[#06233a]/10" />

                <motion.div variants={listItemReveal}>
                  <div className="mb-4 flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${plan.accentText}`} />
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5e6b75]">
                      Important Notes
                    </p>
                  </div>

                  <div className="space-y-3">
                    {plan.notes.map((note) => (
                      <motion.div
                        key={note}
                        className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#2e3f4c]"
                        variants={listItemReveal}
                      >
                        <span
                          className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full ${plan.checkBg}`}
                        >
                          <Check
                            className="h-3.5 w-3.5 text-white"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </span>
                        {note}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto mt-12 grid max-w-5xl gap-4 rounded-[24px] border border-white/45 bg-white/45 p-5 text-[#06233a] shadow-[0_18px_45px_rgba(6,35,58,.18)] ring-1 ring-white/35 backdrop-blur-[18px] sm:grid-cols-3 sm:p-6 lg:mt-16"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: smoothEase }}
        >
          <div className="flex gap-3">
            <UsersRound className="mt-1 h-5 w-5 shrink-0 text-[#e6a334]" />
            <p className="text-sm font-semibold leading-6">
              Maximum 50 persons are allowed in standard booking.
            </p>
          </div>

          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#e6a334]" />
            <p className="text-sm font-semibold leading-6">
              Security deposit is refundable after property inspection.
            </p>
          </div>

          <div className="flex gap-3">
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