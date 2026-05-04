import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function useMotionOK() {
  const reduce = useReducedMotion();
  return !reduce;
}

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}>;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: RevealProps) {
  const motionOK = useMotionOK();

  return (
    <motion.div
      className={className}
      initial={motionOK ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-120px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.9, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

