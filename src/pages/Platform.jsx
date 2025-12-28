import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Sun, Moon, Monitor, BarChart2, Terminal, Check } from 'lucide-react';

export default function Platform() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#comparison') {
      // 添加延遲確保 DOM 已經渲染
      setTimeout(() => {
        const element = document.getElementById('comparison');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);


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
              <Monitor className="text-white" size={22} />
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
            <div className="inline-flex items-center gap-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-8 border border-blue-500/20">
              <Monitor size={20} />
              平臺設置教程
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tighter">
              平臺教程
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              從 Rithmic 數據連接到 MT5 EA 安裝，手把手解決所有技術難題。
            </p>
          </div>

          {/* Comparison Section */}
          <div id="comparison" className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">選擇戰場: CFD vs 期貨</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">不同的交易風格適合不同的資助商。選擇錯誤可能會讓你的策略失效。</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* CFD Box */}
              <div className="bg-gradient-to-br from-white to-slate-100 dark:from-[#111827] dark:to-[#0B1120] p-10 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <BarChart2 size={150} className="text-emerald-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <BarChart2 size={28} />
                  </div>
                  CFD (差價合約)
                </h3>
                <ul className="space-y-6 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full border border-emerald-500/30"><Check className="text-emerald-500" size={14} /></div>
                    <span className="text-lg">適合 <strong className="text-slate-900 dark:text-white">外匯、黃金 (XAUUSD)、加密貨幣</strong></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full border border-emerald-500/30"><Check className="text-emerald-500" size={14} /></div>
                    <span className="text-lg">平臺: MT4 / MT5 / cTrader / TradeLocker</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full border border-emerald-500/30"><Check className="text-emerald-500" size={14} /></div>
                    <span className="text-lg">規則靈活，少有「每日虧損」硬限制，<strong className="text-slate-900 dark:text-white">適合波段交易</strong></span>
                  </li>
                </ul>
              </div>

              {/* Futures Box - Highlighted */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-10 rounded-3xl border-2 border-blue-500 dark:border-blue-500 relative overflow-hidden shadow-2xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-110">
                  <Terminal size={150} className="text-blue-500" />
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">當前頁面</div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Terminal size={28} />
                  </div>
                  Futures (期貨)
                </h3>
                <ul className="space-y-6 text-slate-700 dark:text-slate-300 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-500/30 p-1 rounded-full border border-blue-500/50"><Check className="text-blue-600 dark:text-blue-400" size={14} /></div>
                    <span className="text-lg">適合 <strong className="text-slate-900 dark:text-white">納指 (NQ)、標普 (ES)、原油 (CL)</strong></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-500/30 p-1 rounded-full border border-blue-500/50"><Check className="text-blue-600 dark:text-blue-400" size={14} /></div>
                    <span className="text-lg">平臺: Tradovate, NinjaTrader, TopstepX</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-500/30 p-1 rounded-full border border-blue-500/50"><Check className="text-blue-600 dark:text-blue-400" size={14} /></div>
                    <span className="text-lg">訂單流透明 (Level 2)，但監管較嚴，<strong className="text-slate-900 dark:text-white">適合日內當沖</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 佔位內容區 */}
          <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
              <Monitor size={48} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">更多內容即將推出</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              我們正在精心準備更多詳細的 Futures 平臺設置教程，敬請期待！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
