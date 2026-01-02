import React, { useState, useMemo } from 'react';
import { Zap, Terminal, BarChart2, ArrowRight } from 'lucide-react';
import { propFirms } from '../../data/propFirms';
import FirmCard from './FirmCard';

export default function PropFirmsSection() {
  const [activeTab, setActiveTab] = useState('all');

  // 使用 useMemo 優化過濾邏輯，避免每次渲染都重新計算
  const filteredFirms = useMemo(() => {
    return activeTab === 'all'
      ? propFirms
      : propFirms.filter(firm => firm.type.toLowerCase() === activeTab);
  }, [activeTab]);

  return (
    <section id="firms" className="py-24 px-6 relative z-10 bg-slate-100 dark:bg-[#0B1120]/50 border-y border-slate-200 dark:border-slate-800">
      {/* Decorative elements */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
               <Zap className="text-amber-400 fill-amber-400" size={16} />
               <span className="text-amber-400 dark:text-amber-400 font-bold tracking-wide uppercase text-xs">Editor's Choice</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">精選 Prop Firm 測評</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">實時更新規則、價格與隱藏條款,拒絕資訊不對稱</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white dark:bg-[#111827] p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 flex shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab('futures')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'futures' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
            >
              <Terminal size={14} /> 期貨 (Futures)
            </button>
            <button
              onClick={() => setActiveTab('cfd')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'cfd' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
            >
              <BarChart2 size={14} /> 差價合約 (CFD)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFirms.map(firm => (
            <FirmCard key={firm.id} firm={firm} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all font-medium flex items-center gap-2 mx-auto group">
             查看完整評測報告 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
