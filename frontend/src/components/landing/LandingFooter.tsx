import { Link } from "react-router-dom";
import { GitBranch, Globe, Mail } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="relative pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-[1px] bg-outline-variant/15" />

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="General Study"
              className="h-10 w-10 rounded-2xl"
            />
            <div>
              <div className="font-semibold tracking-tight">General Study</div>
              <div className="text-xs text-on-surface-variant">
                Smarter study, powered by AI
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/40 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/40 transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/40 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-on-surface-variant">
          <div>© {new Date().getFullYear()} General Study. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 hover:text-on-surface transition-colors"
              aria-label="Website placeholder"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 hover:text-on-surface transition-colors"
              aria-label="Email placeholder"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 hover:text-on-surface transition-colors"
              aria-label="GitHub placeholder"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
