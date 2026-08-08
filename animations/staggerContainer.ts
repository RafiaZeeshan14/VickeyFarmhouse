import type { Variants } from "framer-motion";

export function createStaggerContainer(
  staggerChildren: number,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  };
}
