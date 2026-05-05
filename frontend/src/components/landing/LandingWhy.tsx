import {
  BadgeCheck,
  BookOpenCheck,
  LineChart,
  LockKeyhole,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { Reveal, useMotionOK } from "./MotionPrimitives";

const highlights = [
  {
    icon: Zap,
    title: "Fast, responsive",
    desc: "Optimized interactions so you stay in flow while studying.",
  },
  {
    icon: BookOpenCheck,
    title: "Built for learning",
    desc: "Catalogues, quizzes, and sessions designed around recall.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy-first",
    desc: "Keep your content yours (placeholder copy — adjust to your policy).",
  },
  {
    icon: LineChart,
    title: "Measurable progress",
    desc: "Track streaks, improvement, and coverage across your catalogues.",
  },
  {
    icon: BadgeCheck,
    title: "Confidence loops",
    desc: "Short feedback cycles make it easier to keep showing up daily.",
  },
  {
    icon: Sparkles,
    title: "Polished UI",
    desc: "Glassmorphism + smooth motion for a premium modern feel.",
  },
];

export default function LandingWhy() {
  const motionOK = useMotionOK();

  return (
    <section id="why" className="relative pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm text-tertiary font-semibold tracking-wide">
                Why General Study
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                Designed to feel effortless — and deliver results
              </h2>
              <p className="mt-3 text-on-surface-variant max-w-2xl">
                A modern experience with meaningful motion, clarity-first layouts,
                and components that guide you toward mastery.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <GlassCard className="p-6 sm:p-7">
              <div className="flex max-sm:flex-col items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold tracking-tight">
                    Your study system, finally unified
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Bring content, practice, and progress into one calm dashboard.
                    Replace these placeholders with real screenshots later.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { k: "Catalogues", v: "Structured topics" },
                  { k: "Quizzes", v: "Recall training" },
                  { k: "Sessions", v: "Guided focus" },
                  { k: "Progress", v: "Streaks + insights" },
                ].map((i) => (
                  <div
                    key={i.k}
                    className="rounded-3xl border border-outline-variant/20 bg-surface-container-high/20 p-4"
                  >
                    <div className="text-xs text-on-surface-variant">{i.k}</div>
                    <div className="mt-1 font-semibold">{i.v}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.1}>
            <motion.div
              whileHover={motionOK ? { y: -6 } : {}}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <GlassCard className="h-full p-6 sm:p-7">
                <div className="text-sm font-semibold tracking-tight">
                  What you get out of the box
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    "Glassmorphism layouts + shadows",
                    "Scroll reveals + micro-interactions",
                    "Mobile-first sections and cards",
                    "Placeholder visuals you can replace",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-start gap-3 rounded-2xl border border-outline-variant/15 bg-surface-container-high/20 px-4 py-3 text-sm text-on-surface-variant"
                    >
                      <BadgeCheck className="h-5 w-5 text-tertiary mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, idx) => (
            <Reveal key={h.title} delay={0.05 + idx * 0.06}>
              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-surface-container-high/40 border border-outline-variant/20 flex items-center justify-center">
                    <h.icon className="h-5 w-5 text-tertiary" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight">
                      {h.title}
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {h.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

