import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import GlassCard from "./GlassCard";
import { Reveal, useMotionOK } from "./MotionPrimitives";

const faqs = [
  {
    q: "How does the AI catalogue generation work?",
    a: "Upload a PDF, slide deck, or document. Our system extracts the text, processes it with LLaMA 3.1 70B via Groq API, and generates a structured catalogue with topics, summaries, and quiz questions automatically.",
  },
  {
    q: "How are quizzes graded?",
    a: "Quizzes are multiple-choice questions auto-generated from your content. The system grades your answers instantly and awards 5 points for each correct answer.",
  },
  {
    q: "What is the streak system?",
    a: "Login daily to maintain your streak. The streak counter increments for consecutive days of activity and resets if you skip a day. Streaks are tracked alongside your points for gamification.",
  },
  {
    q: "Can I share resources with other students?",
    a: "Yes. General Study is a community resource library. Uploaded resources go through admin approval before becoming visible to all users in your faculty or department.",
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
            Common questions
          </h2>
          <p className="mt-3 text-on-surface-variant max-w-2xl">
            Learn more about how General Study works and what makes it different.
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

