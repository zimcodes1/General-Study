import { Brain, Layers3, Sparkles, Timer, Wand2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { Reveal, useMotionOK } from "./MotionPrimitives";

const features = [
  {
    icon: Sparkles,
    title: "Clean, focused UI",
    desc: "A calm workspace designed for deep work — no distractions, just momentum.",
  },
  {
    icon: Brain,
    title: "AI explanations",
    desc: "Ask “why” and get structured answers, examples, and clarifications on demand.",
  },
  {
    icon: Wand2,
    title: "Quizzes & assessments",
    desc: "Generate practice questions and verify mastery with quick feedback loops.",
  },
  {
    icon: Layers3,
    title: "Catalogues that scale",
    desc: "Organize topics into catalogue trees so your study plan stays navigable.",
  },
  {
    icon: Timer,
    title: "Guided sessions",
    desc: "Time-boxed learning sessions keep you moving, with breaks when you need them.",
  },
  {
    icon: ShieldCheck,
    title: "Progress & accountability",
    desc: "Track streaks, progress, and milestones to stay consistent and confident.",
  },
];

export default function LandingFeatures() {
  const motionOK = useMotionOK();

  return (
    <section id="features" className="relative pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm text-tertiary font-semibold tracking-wide">
                Features
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                Everything you need to study like a pro
              </h2>
              <p className="mt-3 text-on-surface-variant max-w-2xl">
                Modern glassmorphism UI, smooth motion, and a workflow that turns
                content into results.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <Reveal key={f.title} delay={idx * 0.06}>
              <motion.div
                whileHover={motionOK ? { y: -6, scale: 1.01 } : {}}
                transition={{ duration: 0.25 }}
              >
                <GlassCard className="h-full p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl sm:bg-surface-container-high/40 sm:border border-outline-variant/20 flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-tertiary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold tracking-tight">
                        {f.title}
                      </div>
                      <p className="mt-2 text-sm text-on-surface-variant">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 h-[1px] bg-outline-variant/15" />
                  <div className="mt-4 text-xs text-on-surface-variant">
                    Placeholder note: Replace this copy to match your exact product
                    messaging.
                  </div>
                </GlassCard>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

