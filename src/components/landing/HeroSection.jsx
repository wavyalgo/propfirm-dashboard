import React from 'react';
import { BookOpen, Zap, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <header className="pt-36 pb-24 px-6 relative overflow-hidden z-10">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-60"></div>
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen opacity-50"></div>

      <div className="container mx-auto text-center max-w-5xl relative z-10">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/40 transition-colors cursor-pointer group">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="group-hover:text-emerald-300 transition-colors">System Update: Topstep 1折優惠中</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>

        {/* UPDATED: Headline and Subtext */}
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tighter">
          深度解密 <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x">PROP FIRMS</span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          <span className="text-emerald-500 dark:text-emerald-400 font-bold">PropHack</span> 致力於為交易員提供最專業的深度剖析。我們挖掘每一條隱藏條款與魔鬼細節,客觀評測平臺優劣,助您看清真相,在規則迷宮中做出最明智的資金帳戶選擇。
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1">
            <Zap size={20} className="fill-slate-950" />
            查看推薦平臺
          </button>
          <button className="bg-slate-100 dark:bg-[#111827]/80 hover:bg-slate-200 dark:hover:bg-[#1f2937] backdrop-blur text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg border border-slate-300 dark:border-slate-700 hover:border-emerald-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
            <BookOpen size={20} />
            新手入門指南
          </button>
        </div>
      </div>
    </header>
  );
}
