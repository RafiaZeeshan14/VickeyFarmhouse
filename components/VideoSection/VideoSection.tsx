"use client";

import { createFadeUp, createStaggerContainer } from "@/animations";
import heroImage from "@/public/hero.png";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const textContainer = createStaggerContainer(0.14, 0.15);
const textReveal = createFadeUp({ duration: 0.75 });

export default function VideoSection() {
  const shouldReduceMotion = useReducedMotion();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const shouldLoadVideo = useInView(videoContainerRef, {
    once: true,
    margin: "300px 0px",
  });

  return (
    <section className="scroll-mt-28 relative -mt-px overflow-hidden bg-[#062b45] px-4 pb-24 pt-14 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-8 lg:grid-cols-[0.46fr_0.54fr] xl:max-w-[1500px] xl:gap-10">
        <div className="relative h-[520px] overflow-hidden sm:h-[560px] lg:h-[640px]">
          <div className="absolute inset-y-0 left-0 w-full rounded-xl bg-white shadow-[0_28px_70px_rgba(0,0,0,.2)] [clip-path:polygon(7%_0,100%_0,92%_100%,0_100%)]" />
          <div className="absolute inset-y-0 right-0 w-[44%] rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,.88),#fff)] shadow-[0_28px_70px_rgba(0,0,0,.12)] [clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]" />
          <div className="pointer-events-none absolute right-[39%] top-0 z-10 h-28 w-1.5 -skew-x-[10deg] bg-[#062b45]" />
          <div className="pointer-events-none absolute bottom-0 right-[39%] z-10 h-28 w-1.5 -skew-x-[10deg] bg-[#062b45]" />

          <motion.div
            className="relative z-10 flex h-full max-w-[430px] flex-col justify-center px-8 py-8 text-[#06233a] sm:px-12 sm:py-10 xl:px-14"
            variants={textContainer}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.p
              className="mb-4 max-w-[280px] font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(36px,4vw,50px)] italic leading-[.95] text-[#e2a13a] md:mb-5"
              variants={textReveal}
            >
              Take a Virtual Tour
            </motion.p>

            <motion.h2
              className="text-[clamp(36px,3.6vw,52px)] font-black uppercase leading-[1.02] tracking-normal"
              variants={textReveal}
            >
              Feel The Vibes
              <span className="block text-[#f5a40b]">
                Before You Arrive!
              </span>
            </motion.h2>

            <motion.p
              className="mt-5 max-w-[360px] text-[15px] font-semibold leading-7 text-[#17334a] sm:text-base"
              variants={textReveal}
            >
              Watch our video and explore the beauty, ambience, and experiences
              that await you.
            </motion.p>
          </motion.div>
        </div>

        <div
          ref={videoContainerRef}
          className="relative h-[520px] overflow-hidden rounded-xl bg-black shadow-[0_28px_70px_rgba(0,0,0,.26)] ring-1 ring-white/10 sm:h-[560px] lg:h-[640px]"
        >
          <video
            id="tour-video"
            className="absolute inset-0 h-full w-full object-cover"
            poster={shouldLoadVideo ? heroImage.src : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay
          >
            {shouldLoadVideo ? (
              <source src="/farmVideo2.mp4" type="video/mp4" />
            ) : null}
          </video>
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      <div
        className="absolute bottom-[-1px] left-0 right-0 z-30 h-[clamp(36px,5.5vw,76px)] bg-[#fbfaf7]"
        style={{
          clipPath:
            "polygon(0 43%, 18% 59%, 35% 50%, 52% 29%, 69% 51%, 84% 38%, 100% 54%, 100% 100%, 0 100%)",
        }}
      />
    </section>
  );
}
