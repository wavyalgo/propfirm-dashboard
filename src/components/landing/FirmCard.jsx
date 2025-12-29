import React, { useState } from 'react';
import { Terminal, BarChart2, Star, Monitor, Check, Copy, ChevronRight } from 'lucide-react';
import RadarChart from './RadarChart';

const FirmCard = ({ firm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(firm.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 定義主題色樣式
  const isFutures = firm.theme === 'blue';
  const themeColors = {
    badgeBg: isFutures ? 'bg-blue-500/10' : firm.theme === 'purple' ? 'bg-purple-500/10' : 'bg-emerald-500/10',
    badgeText: isFutures ? 'text-blue-400' : firm.theme === 'purple' ? 'text-purple-400' : 'text-emerald-400',
    borderHover: isFutures ? 'group-hover:border-blue-500/50' : firm.theme === 'purple' ? 'group-hover:border-purple-500/50' : 'group-hover:border-emerald-500/50',
    buttonGradient: isFutures
      ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
      : firm.theme === 'purple'
        ? 'from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-900/20'
        : 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20',
    glow: isFutures ? 'from-blue-500/5' : firm.theme === 'purple' ? 'from-purple-500/5' : 'from-emerald-500/5'
  };

  return (
    <div className={`relative group bg-white dark:bg-[#0F172A]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 ${themeColors.borderHover} hover:shadow-2xl hover:-translate-y-1`}>

      {/* 頂部發光背景 */}
      <div className={`absolute inset-0 bg-gradient-to-b ${themeColors.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

      <div className="p-6 relative z-10 flex flex-col h-full">
        {/* 頭部標籤 */}
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-md text-[10px] font-bold border border-white/5 uppercase tracking-wider ${themeColors.badgeBg} ${themeColors.badgeText} flex items-center gap-1.5`}>
            {firm.type === 'Futures' ? <Terminal size={12}/> : <BarChart2 size={12}/>}
            {firm.type}
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/5 px-2 py-1 rounded border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <Star size={12} fill="currentColor" />
            {firm.rating}
          </div>
        </div>

        {/* 公司名稱與價格 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-tight font-display">{firm.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{firm.price}</span>
            <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">{firm.billingCycle} 起</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isFutures ? 'bg-blue-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`}></div>
            {firm.bestFor}
          </div>
        </div>

        {/* 能力值雷達圖 */}
        <div className="mb-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/50">
          <div className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-3 text-center">綜合能力評估</div>
          <RadarChart stats={firm.stats} color={firm.theme} />
        </div>

        {/* 特色列表 */}
        <div className="space-y-4 mb-6 flex-grow">
          <div>
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-600 uppercase tracking-widest mb-2">Platform</div>
            <div className="pl-0">
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-[#0B1120] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Monitor size={12} className="text-slate-500 dark:text-slate-500" />
                <span className="truncate">{firm.platform}</span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {firm.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                <div className={`mt-1 p-0.5 rounded-full ${themeColors.badgeBg}`}>
                  <Check size={10} className={themeColors.badgeText} />
                </div>
                <span className="leading-snug text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部行動區 */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50">
          <div className="bg-slate-100 dark:bg-[#0B1120] p-1.5 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-800 mb-3 relative overflow-hidden">
            <div className="pl-2">
              <p className="text-[10px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-wider">Code</p>
              <p className={`font-mono font-bold tracking-widest text-sm ${themeColors.badgeText}`}>{firm.code}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              title="複製折扣碼"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          <button className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg bg-gradient-to-r ${themeColors.buttonGradient} flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] border border-white/10`}>
            開始測評 <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirmCard;
