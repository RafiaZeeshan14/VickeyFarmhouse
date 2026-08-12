import type { Variants } from "framer-motion";
import { smoothEase, type AnimationEase } from "./easings";

interface ScaleRevealOptions {
  initialScale?: number;
  x?: number;
  y?: number;
  duration?: number;
  ease?: AnimationEase;
}

export function createScaleReveal({
  initialScale = 0.98,
  x = 0,
  y = 0,
  duration = 0.8,
  ease = smoothEase,
}: ScaleRevealOptions = {}): Variants {
  return {
    hidden: { opacity: 0, scale: initialScale, x, y },
    show: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { duration, ease },
    },
  };
}
