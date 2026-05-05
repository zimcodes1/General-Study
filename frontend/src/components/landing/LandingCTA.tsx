import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import GlassCard from "./GlassCard";
import { Reveal, useMotionOK } from "./MotionPrimitives";

export default function LandingCTA() {
  const motionOK = useMotionOK();

  return (
    <section className="relative pt-20 sm:pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <GlassCard className="overflow-hidden">
            <div className="relative p-7 sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(155,168,255,0.22),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_80%_100%,rgba(129,236,255,0.18),transparent_60%)]" />

              <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-low/30 backdrop-blur-[24px] px-4 py-2 text-xs text-on-surface-variant">
                    <Sparkles className="h-4 w-4 text-tertiary" />
                    Free to start
                  </div>
                  <h3 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                    Start learning smarter today
                  </h3>
                  <p className="mt-3 text-on-surface-variant max-w-xl">
                    Sign up, upload your first file, and get an AI-generated learning
                    catalogue in minutes. No credit card required.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold hover:shadow-[0_0_46px_rgba(155,168,255,0.35)] transition-all"
                  >
                    Get started <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className={[
                      "inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full",
                      "border border-outline-variant/25 bg-surface-container-low/30 backdrop-blur-[24px]",
                      "text-on-surface hover:bg-surface-container-high/35 transition-colors",
                      motionOK ? "hover:-translate-y-0.5" : "",
                    ].join(" ")}
                  >
                    I already have an account
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
