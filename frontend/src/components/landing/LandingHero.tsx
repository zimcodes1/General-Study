import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Sparkles,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { useMotionOK } from "./MotionPrimitives";

function HeroMockup() {
  const motionOK = useMotionOK();

  return (
    <motion.div
      initial={motionOK ? { opacity: 0, y: 18, rotate: -2 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1], delay: 0.15 }}
      className="relative"
    >
      <div className="absolute -inset-6 rounded-[48px] bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/10 blur-2xl" />

      <GlassCard className="overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold tracking-tight">Study cockpit</div>
                <div className="text-xs text-on-surface-variant">
                  Your plan, progress, and AI help — together
                </div>
              </div>
            </div>
            <div className="max-sm:hidden rounded-full border border-outline-variant/20 bg-surface-container-high/30 px-3 py-1 text-xs text-on-surface-variant">
              Live preview
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { icon: Brain, label: "Explain", value: "Instant clarity" },
              { icon: Wand2, label: "Generate", value: "Smart quizzes" },
              { icon: ShieldCheck, label: "Track", value: "Daily momentum" },
              { icon: Sparkles, label: "Focus", value: "Zero fluff" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-3xl border border-outline-variant/20 bg-surface-container-high/25 p-4"
              >
                <c.icon className="h-5 w-5 text-tertiary" />
                <div className="mt-3 text-sm font-semibold">{c.label}</div>
                <div className="text-xs text-on-surface-variant">{c.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-outline-variant/20 bg-surface-container-high/25 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Today’s session</div>
              <div className="text-xs text-on-surface-variant">25 min</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-surface-variant/60 overflow-hidden">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-primary to-secondary" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span>Spaced repetition</span>
              <span>+12% recall</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function LandingHero() {
  const motionOK = useMotionOK();

  return (
    <section className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
          animate={motionOK ? { y: [0, 22, 0], opacity: [0.65, 0.9, 0.65] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-44 -left-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl"
          animate={motionOK ? { x: [0, 26, 0], y: [0, -18, 0] } : {}}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-tertiary/18 blur-3xl"
          animate={motionOK ? { x: [0, -18, 0], opacity: [0.55, 0.85, 0.55] } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_0%,rgba(155,168,255,0.15),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl max-sm:pb-10 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.div
              initial={motionOK ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.9, 0.2, 1] }}
              className="inline-flex items-center gap-2 rounded-full sm:border border-outline-variant/50 bg-surface-container-low/40 backdrop-blur-[24px] px-4 py-4 text-xs text-on-surface-variant"
            >
              <Sparkles className="h-4 w-4 text-tertiary" />
              Modern study system for serious learners
            </motion.div>

            <motion.h1
              initial={motionOK ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1], delay: 0.05 }}
              className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.02]"
            >
              Learn faster.
              <span className="block bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
                Remember longer.
              </span>
            </motion.h1>

            <motion.p
              initial={motionOK ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1], delay: 0.12 }}
              className="mt-6 text-base sm:text-lg text-on-surface-variant max-w-xl"
            >
              General Study turns your notes into structured catalogues, quizzes, and
              guided sessions — with AI explanations that keep you in flow.
            </motion.p>

            <motion.div
              initial={motionOK ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1], delay: 0.18 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold hover:shadow-[0_0_46px_rgba(155,168,255,0.35)] transition-all"
              >
                Start free <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-outline-variant/25 bg-surface-container-low/30 backdrop-blur-[24px] text-on-surface hover:bg-surface-container-high/35 transition-colors"
              >
                See what you get
              </a>
            </motion.div>

            <motion.div
              initial={motionOK ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1], delay: 0.25 }}
              className="mt-10 grid grid-cols-3 gap-4 max-w-xl"
            >
              {[
                { stat: "2x", label: "Faster recall" },
                { stat: "AI", label: "Explanations" },
                { stat: "24/7", label: "Study coach" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-outline-variant/50 bg-surface-container-low/50 backdrop-blur-[24px] px-4 py-4"
                >
                  <div className="text-xl font-bold max-sm:text-center">{s.stat}</div>
                  <div className="mt-1 text-xs text-on-surface-variant">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

