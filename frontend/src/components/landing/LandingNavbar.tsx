import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMotionOK } from "./MotionPrimitives";

type NavLink = { label: string; targetId: string };

export default function LandingNavbar() {
  const motionOK = useMotionOK();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = useMemo<NavLink[]>(
    () => [
      { label: "Features", targetId: "features" },
      { label: "How it works", targetId: "how" },
      { label: "Why us", targetId: "why" },
      { label: "FAQ", targetId: "faq" },
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (targetId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;
    setOpen(false);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={motionOK ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
      className={[
        "fixed inset-x-0 top-0 z-50",
        scrolled
          ? "bg-surface-container-low/40 backdrop-blur-[32px] border-b border-outline-variant/20"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
            aria-label="Go to home"
          >
            <img
              src="/images/logo.png"
              alt="General Study"
              className="h-9 w-9 rounded-xl"
            />
            <div className="leading-tight text-left">
              <div className="font-semibold tracking-tight">General Study</div>
              <div className="text-xs text-on-surface-variant">
                Smarter study, powered by AI
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.targetId}
                href={`#${l.targetId}`}
                onClick={scrollTo(l.targetId)}
                className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-on-primary-fixed bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_40px_rgba(155,168,255,0.35)] transition-all"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-2xl border border-outline-variant/25 bg-surface-container-low/40 backdrop-blur-[24px] p-3 text-on-surface"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="pb-4 lg:hidden">
            <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low/40 backdrop-blur-[32px] p-4">
              <div className="flex flex-col gap-2">
                {links.map((l) => (
                  <a
                    key={l.targetId}
                    href={`#${l.targetId}`}
                    onClick={scrollTo(l.targetId)}
                    className="rounded-2xl px-3 py-3 text-sm text-on-surface hover:bg-surface-container-high/40 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-center px-4 py-3 rounded-2xl border border-outline-variant/20 bg-surface-container-high/30 text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="text-center px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
