import type { Variants } from "framer-motion";
import { smoothEase, type AnimationEase } from "./easings";

interface SlideRevealOptions {
  x: number;
  duration?: number;
  ease?: AnimationEase;
}

export function createSlideReveal({
  x,
  duration = 0.55,
  ease = smoothEase,
}: SlideRevealOptions): Variants {
  return {
    hidden: { opacity: 0, x },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration, ease },
    },
  };
}
