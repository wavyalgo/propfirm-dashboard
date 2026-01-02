import React from 'react';
import { Calendar, Calculator } from 'lucide-react';
import EconomicCalendar from '../tools/EconomicCalendar';
import PositionCalculator from '../tools/PositionCalculator';
import { useTheme } from '../../context/ThemeContext';

export default function TradingToolsSection() {
  const { theme } = useTheme();

  return (
    <section id="tools" className="relative py-24 overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            交易工具
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            專業交易工具，包含即時財經日曆與精準倉位計算器
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-12 gap-6 max-w-[1400px] mx-auto">
          {/* 財經日曆 - 左側大區塊 */}
          <div className="col-span-12 lg:col-span-8" id="calendar">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-500/30">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg shadow-orange-500/30">
                    <Calendar className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">財經日曆</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">即時追蹤全球重要經濟事件</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="h-[850px] lg:h-[950px]">
                <EconomicCalendar theme={theme} />
              </div>
            </div>
          </div>

          {/* 倉位計算器 - 右側區塊 */}
          <div className="col-span-12 lg:col-span-4" id="calculator">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-500/30 sticky top-24">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/30">
                    <Calculator className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">倉位計算器</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">精準計算交易風險與倉位</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="h-[850px] lg:h-[950px]">
                <PositionCalculator theme={theme} />
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            所有工具僅供教育和參考用途，請謹慎評估風險後使用
          </p>
        </div>
      </div>
    </section>
  );
}
