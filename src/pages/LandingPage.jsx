import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import PartnersSection from '../components/landing/PartnersSection';
import AboutUsSection from '../components/landing/AboutUsSection';
import DiscountSection from '../components/landing/DiscountSection';
import PropFirmsSection from '../components/landing/PropFirmsSection';
import CommunitySection from '../components/landing/CommunitySection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050911] text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">

      {/* 全局背景網格 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
      </div>

      {/* 注入動畫樣式 */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .glass-nav {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .dark .glass-nav {
          background: rgba(5, 9, 17, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Navigation */}
      <Navigation
        theme={theme}
        toggleTheme={toggleTheme}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Partners Section (inside Hero container) */}
      <div className="container mx-auto px-6 -mt-12">
        <PartnersSection />
      </div>

      {/* About Us Section */}
      <AboutUsSection />

      {/* Discount Center Section */}
      <DiscountSection />

      {/* Prop Firm Directory */}
      <PropFirmsSection />

      {/* Community / Discord CTA */}
      <CommunitySection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
