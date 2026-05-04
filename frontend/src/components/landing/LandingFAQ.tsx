import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import GlassCard from "./GlassCard";
import { Reveal, useMotionOK } from "./MotionPrimitives";

const faqs = [
  {
    q: "Can I replace the placeholder images/copy?",
    a: "Yes — everything here is designed as a clean scaffold. Swap in your brand visuals and product copy anytime.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The layout is mobile-first with responsive typography and card grids.",
  },
  {
    q: "Is Framer Motion required?",
    a: "This landing page uses Framer Motion for reveal animations and micro-interactions. If you want a no-JS animation approach, we can switch to CSS-only later.",
  },
  {
    q: "Where are the landing components stored?",
    a: "All landing UI components live in src/components/landing/* as requested.",
  },
];

export default function LandingFAQ() {
  const motionOK = useMotionOK();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-sm text-tertiary font-semibold tracking-wide">
            FAQ
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Quick answers
          </h2>
          <p className="mt-3 text-on-surface-variant max-w-2xl">
            Replace these with your real FAQs whenever you’re ready.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4">
          {faqs.map((f, idx) => {
            const open = openIndex === idx;
            return (
              <Reveal key={f.q} delay={idx * 0.06}>
                <GlassCard className="p-0 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-semibold tracking-tight">{f.q}</span>
                    <motion.span
                      animate={motionOK ? { rotate: open ? 180 : 0 } : {}}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="h-5 w-5 text-on-surface-variant" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="px-6 pb-5"
                      >
                        <div className="h-[1px] bg-outline-variant/15 mb-4" />
                        <p className="text-sm text-on-surface-variant">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

