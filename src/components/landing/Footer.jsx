import React from 'react';
import { Terminal, MessageCircle, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-[#02040a] py-16 px-6 border-t border-slate-200 dark:border-slate-900 relative z-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg">
              <Terminal className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Prop<span className="text-emerald-500 dark:text-emerald-500">Hack</span></span>
          </div>
          <p className="text-slate-600 dark:text-slate-500 max-w-sm text-sm leading-relaxed mb-6 font-medium">
            致力於幫助交易員通過 Prop Firm 考核,獲取即時資訊與技術支持。我們堅信,正確的工具與社群能讓交易之路不再艱難。
          </p>
          <div className="flex gap-4">
             {/* Social Icons placeholder */}
             <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/20"><MessageCircle size={18}/></div>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-lg tracking-tight">快速鏈接</h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li><a href="/knowledge" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> Propfirm 基礎知識</a></li>
            <li><a href="/platform" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 平臺設置</a></li>
            <li><a href="/withdrawal" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 付款出金流程</a></li>
            <li><a href="#firms" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> Propfirm測評</a></li>
            <li><a href="#discounts" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 折扣中心</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-lg tracking-tight">資源工具</h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li><a href="#calendar" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 財經日曆</a></li>
            <li><a href="#calculator" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 倉位風險計算器</a></li>
            <li><a href="#tools" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 推薦工具</a></li>
            <li><a href="#courses" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 交易策略專區</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-900 text-center text-slate-500 dark:text-slate-600 text-xs font-medium flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2024 PropHack. All rights reserved.</span>
        <div className="flex gap-6">
           <a href="#" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">隱私政策</a>
           <a href="#" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">服務條款</a>
        </div>
      </div>
    </footer>
  );
}
