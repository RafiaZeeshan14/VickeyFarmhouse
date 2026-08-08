"use client";

import { createFadeUp, smoothEase } from "@/animations";
import { facilities } from "@/data/facilities";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const fadeUp = createFadeUp({ duration: 0.75 });

function getSlideDistance() {
  if (typeof window === "undefined") return 390;
  if (window.innerWidth >= 1280) return 635;
  if (window.innerWidth >= 1024) return 555;
  return 390;
}

export default function Facilities() {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const changeSlide = (step: number) => {
    setActive((current) =>
      (current + step + facilities.length) % facilities.length,
    );
  };

  return (
    <section
      id="facilities"
      className="scroll-mt-28 relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1700px]">
        <motion.div
          className="mx-auto mb-12 max-w-5xl text-center"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(37px,6vw,46px)] italic leading-none text-[#e4a43b]"
          >
            Our Facilities
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-[clamp(34px,6vw,70px)] font-black uppercase leading-[.98] tracking-tight text-[#06233a]"
          >
            Everything You Need
            <span className="block">
              For A <span className="text-[#e6a334]">Perfect Day Out!</span>
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-3xl text-[16px] font-medium leading-8 text-[#294258] sm:text-lg"
          >
            Explore premium farmhouse spaces including pool, parking, indoor
            games, BBQ area, lawns, rooms, play area, bonfire, dining, and more.
          </motion.p>
        </motion.div>

        <div className="relative overflow-hidden rounded-[32px] bg-white px-5 py-8 shadow-[0_28px_90px_rgba(6,35,58,.12)] sm:px-8 lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#e6a334]/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#2f9ad8]/15 blur-3xl" />

          <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#e6a334]">
                Vicky Farmhouse
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase text-[#06233a] sm:text-3xl">
                Explore Facilities
              </h3>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => changeSlide(-1)}
                className="grid h-12 w-12 place-items-center rounded-full bg-[#06233a] text-2xl text-white shadow-lg transition hover:bg-[#e6a334] hover:text-[#06233a] sm:h-14 sm:w-14"
                aria-label="Previous facility"
              >
                ←
              </button>
              <button
                onClick={() => changeSlide(1)}
                className="grid h-12 w-12 place-items-center rounded-full bg-[#e6a334] text-2xl text-[#06233a] shadow-lg transition hover:bg-[#06233a] hover:text-white sm:h-14 sm:w-14"
                aria-label="Next facility"
              >
                →
              </button>
            </div>
          </div>

          <div className="relative z-10 h-[430px] overflow-hidden sm:h-[500px] lg:h-[560px] xl:h-[620px]">
            {facilities.map((facility, index) => {
              const offset = index - active;

              return (
                <motion.article
                  key={`${facility.title}-${index}`}
                  className="absolute left-0 top-0 h-full w-[82vw] max-w-[360px] overflow-hidden rounded-[26px] bg-[#06233a] shadow-[0_26px_70px_rgba(6,35,58,.22)] ring-1 ring-white/60 sm:max-w-[430px] lg:max-w-[520px] xl:max-w-[600px]"
                  animate={{
                    x: offset * getSlideDistance(),
                    scale: index === active ? 1 : 0.9,
                    opacity:
                      offset < 0
                        ? 0
                        : offset > 2
                          ? 0
                          : index === active
                            ? 1
                            : 0.5,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  transition={{ duration: 0.75, ease: smoothEase }}
                >
                  {facility.showFullImage ? (
                    <Image
                      src={facility.image}
                      alt=""
                      fill
                      aria-hidden="true"
                      className="scale-110 object-cover opacity-60 blur-xl"
                      sizes="(min-width: 1280px) 600px, (min-width: 1024px) 520px, 82vw"
                    />
                  ) : null}
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    className={
                      facility.showFullImage ? "object-contain" : "object-cover"
                    }
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 520px, 82vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06233a]/95 via-[#06233a]/35 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-7 xl:p-9">
                    <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/20 text-[#e6a334] backdrop-blur-md ring-1 ring-white/30 xl:h-16 xl:w-16">
                      <facility.Icon className="h-7 w-7 xl:h-8 xl:w-8" />
                    </span>
                    <h3 className="text-2xl font-black uppercase leading-tight xl:text-4xl">
                      {facility.title}
                    </h3>
                    <p className="mt-3 max-w-[430px] text-sm font-medium leading-6 text-white/85 sm:text-base">
                      {facility.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="relative z-10 mt-7 flex flex-wrap justify-center gap-2">
            {facilities.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  active === index
                    ? "w-9 bg-[#e6a334]"
                    : "w-2.5 bg-[#06233a]/25"
                }`}
                aria-label={`Go to facility ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}