"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    Icon: MapPin,
    text: "358R+X3V, A Rehman Gabol Goth Gadap Town, Karachi",
  },
  {
    Icon: Phone,
    text: "+92 3712108053",
  },
  {
    Icon: Mail,
    text: "Vickyfarmhouse@gmail.com",
  },
];

const smoothEase = [0.25, 1, 0.5, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

const mapReveal: Variants = {
  hidden: { opacity: 0, scale: 0.98, x: 28 },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.85, ease: smoothEase },
  },
};

export default function Location() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="location"
      className="scroll-mt-28 relative overflow-hidden bg-cover bg-center bg-fixed px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(251,250,247,.50), rgba(251,250,247,.50)), url('/villa6.jpg')",
      }}
    >
      <motion.div
        className="mx-auto grid max-w-7xl overflow-hidden rounded-xl bg-white shadow-[0_18px_45px_rgba(6,35,58,.1)] ring-1 ring-[#06233a]/8 lg:grid-cols-[0.42fr_0.58fr]"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.22 }}
      >
        <motion.div
          className="px-6 py-10 text-center sm:px-10 lg:py-14 lg:text-left"
          variants={containerVariants}
        >
          <motion.p
            className="mb-3 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]"
            variants={fadeUp}
          >
            Find Us
          </motion.p>

          <motion.h2
            className="text-[clamp(32px,6vw,52px)] font-black uppercase leading-[1.05] tracking-normal"
            variants={fadeUp}
          >
            Easy To Reach,
            <span className="block text-[#e6a334]">Hard To Leave!</span>
          </motion.h2>

          <motion.p
            className="mt-5 max-w-md text-[15px] font-semibold leading-7 text-[#5a6670] lg:mx-0"
            variants={fadeUp}
          >
            Located in a peaceful area, Vicky Farmhouse is just a short drive
            away from the city.
          </motion.p>

          <motion.div className="mt-8 grid gap-4" variants={containerVariants}>
            {contactDetails.map((item) => (
              <motion.div
                key={item.text}
                className="grid grid-cols-[42px_auto] items-center gap-3 text-left"
                variants={fadeUp}
                whileHover={shouldReduceMotion ? undefined : { x: 4 }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fff4df] text-[#e6a334]">
                  <item.Icon
                    className="h-5 w-5"
                    strokeWidth={2.3}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-sm font-semibold leading-6 text-[#344756] sm:text-base">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="min-h-[360px] bg-[#edf1ec] lg:min-h-[480px]"
          variants={mapReveal}
        >
          <iframe
            className="h-full min-h-[360px] w-full border-0 lg:min-h-[480px]"
            title="Vicky Farmhouse map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.0128470269665!2d67.1894532!3d25.0675537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34f006e3045f5%3A0xbef464f04a192b17!2sVicky%E2%80%99s%20Farmhouse%20Gadap!5e0!3m2!1sen!2s!4v1780569888939!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
