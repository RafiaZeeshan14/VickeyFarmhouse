import type { Variants } from "framer-motion";
import { smoothEase, type AnimationEase } from "./easings";

interface FadeUpOptions {
  distance?: number;
  duration?: number;
  ease?: AnimationEase;
}

export function createFadeUp({
  distance = 24,
  duration = 0.7,
  ease = smoothEase,
}: FadeUpOptions = {}): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, ease },
    },
  };
}
