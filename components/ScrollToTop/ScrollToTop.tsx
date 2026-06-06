"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#06233a] text-white shadow-[0_18px_38px_rgba(6,35,58,.28)] ring-1 ring-white/45 transition-colors hover:bg-[#e6a334] hover:text-[#06233a] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#e6a334]/35 sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
          type="button"
          aria-label="Go to top"
          onClick={scrollToTop}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.92 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          whileHover={shouldReduceMotion ? undefined : { y: -3 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        >
          <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.6} aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
