import { Navigate } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingExplainer from "../components/landing/LandingExplainer";
import LandingWhy from "../components/landing/LandingWhy";
import LandingFAQ from "../components/landing/LandingFAQ";
import LandingCTA from "../components/landing/LandingCTA";
import LandingFooter from "../components/landing/LandingFooter";
import { useEffect } from "react";
import { auth } from "../utils/auth";

export default function Landing() {
  useEffect(() => {
    document.title = "General Study — Smarter study, powered by AI";
  }, []);

  if (auth.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingExplainer />
        <LandingWhy />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}

