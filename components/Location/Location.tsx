"use client";

import {
  createFadeUp,
  createScaleReveal,
  createStaggerContainer,
} from "@/animations";
import { siteContact } from "@/lib/site";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    Icon: MapPin,
    text: siteContact.address,
  },
  {
    Icon: Phone,
    text: siteContact.phone,
  },
  {
    Icon: Mail,
    text: siteContact.email,
  },
];

const containerVariants = createStaggerContainer(0.12, 0.12);
const fadeUp = createFadeUp();
const mapReveal = createScaleReveal({ x: 28, duration: 0.85 });

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
            src={siteContact.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
