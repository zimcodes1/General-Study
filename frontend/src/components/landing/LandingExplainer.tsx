import { Check, LayoutDashboard, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { Reveal, useMotionOK } from "./MotionPrimitives";

const steps = [
  {
    icon: LayoutDashboard,
    title: "Upload your materials",
    desc: "Upload PDFs, slides, or documents. AI extracts text and processes it with LLaMA 3.1 70B in the background.",
    bullets: ["PDF support", "Auto text extraction", "Async processing"],
  },
  {
    icon: Sparkles,
    title: "Get structured catalogues",
    desc: "AI generates learning catalogues with topics, summaries, and quiz questions automatically from your content.",
    bullets: ["Topic breakdown", "AI summaries", "Auto quizzes"],
  },
  {
    icon: Wand2,
    title: "Study and earn points",
    desc: "Complete topics, take quizzes, earn 5 points per correct answer, and track your progress with streaks.",
    bullets: ["Quiz grading", "Points system", "Daily streaks"],
  },
];

function ScreenshotPlaceholder() {
  const motionOK = useMotionOK();
  return (
    <motion.div
      aria-hidden
      className="relative h-full w-full rounded-3xl border border-outline-variant/20 bg-surface-container-high/20 overflow-hidden"
      initial={motionOK ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.9, 0.2, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_30%_20%,rgba(129,236,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_320px_at_70%_60%,rgba(166,140,255,0.14),transparent_55%)]" />
      <div className="absolute inset-0 p-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400/60" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
          <div className="h-3 w-3 rounded-full bg-green-400/60" />
          <div className="ml-3 h-2 w-28 rounded-full bg-outline-variant/20" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/20 p-3"
            >
              <div className="h-2.5 w-2/3 rounded-full bg-outline-variant/20" />
              <div className="mt-3 h-2 w-full rounded-full bg-outline-variant/15" />
              <div className="mt-2 h-2 w-5/6 rounded-full bg-outline-variant/12" />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-outline-variant/15 bg-surface-container-low/20 p-4">
          <div className="h-3 w-44 rounded-full bg-outline-variant/18" />
          <div className="mt-3 h-2 w-full rounded-full bg-outline-variant/12" />
          <div className="mt-2 h-2 w-11/12 rounded-full bg-outline-variant/10" />
          <div className="mt-2 h-2 w-10/12 rounded-full bg-outline-variant/10" />
          <div className="mt-4 h-9 w-36 rounded-2xl bg-gradient-to-r from-primary/70 to-secondary/70" />
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingExplainer() {
  return (
    <section id="how" className="relative pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-sm text-tertiary font-semibold tracking-wide">
                How it works
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                Three steps from upload to mastery
              </h2>
              <p className="mt-3 text-on-surface-variant max-w-xl">
                Upload your study materials, let AI process them into structured
                catalogues, then study and track your progress.
              </p>

              <div className="mt-8 space-y-4">
                {steps.map((s, idx) => (
                  <Reveal key={s.title} delay={0.05 + idx * 0.08}>
                    <GlassCard className="p-5">
                      <div className="flex max-sm:flex-col items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-surface-container-high/40 border border-outline-variant/20 flex items-center justify-center">
                          <s.icon className="h-5 w-5 text-tertiary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-lg font-semibold tracking-tight">
                              {s.title}
                            </div>
                            <div className="text-xs text-on-surface-variant border border-outline-variant/20 bg-surface-container-high/20 rounded-full px-2.5 py-1">
                              Step {idx + 1}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-on-surface-variant">
                            {s.desc}
                          </p>

                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {s.bullets.map((b) => (
                              <div
                                key={b}
                                className="flex items-center gap-2 rounded-2xl border border-outline-variant/15 bg-surface-container-high/20 px-3 py-2 text-xs text-on-surface-variant"
                              >
                                <Check className="h-4 w-4 text-tertiary" />
                                {b}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="h-[420px] sm:h-[520px]">
              <ScreenshotPlaceholder />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
