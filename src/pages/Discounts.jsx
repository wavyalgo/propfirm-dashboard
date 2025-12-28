import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Sun, Moon, Zap } from 'lucide-react';

export default function Discounts() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050911] text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">
      {/* 全局背景網格 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
      </div>

      {/* 導航欄 */}
      <nav className="fixed w-full z-50 bg-slate-50/80 dark:bg-[#050911]/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Zap className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              Prop<span className="text-emerald-500">Hack</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white"
              title={theme === 'dark' ? "切換至日間模式" : "切換至夜間模式"}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white font-medium text-sm"
            >
              <Home size={18} />
              返回首頁
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-8 border border-amber-500/20">
              <Zap size={20} className="fill-amber-600 dark:fill-amber-400" />
              獨家優惠
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tighter">
              折扣專區
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              獨家折扣碼與限時優惠，幫您以最低成本開啟 Prop Firm 交易之旅。
            </p>
          </div>

          {/* 佔位內容區 */}
          <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-24 h-24 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <Zap size={48} className="text-amber-500 fill-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">內容即將推出</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              我們正在整理最新的獨家折扣碼與優惠信息，敬請期待！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
