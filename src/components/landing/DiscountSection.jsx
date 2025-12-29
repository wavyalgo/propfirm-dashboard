import React from 'react';
import { Zap } from 'lucide-react';
import { PROP_FIRM_DISCOUNTS } from '../../data/discounts';
import PropFirmDiscountRow from './PropFirmDiscountRow';

export default function DiscountSection() {
  return (
    <section id="discounts" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
              <Zap size={16} className="fill-amber-600 dark:fill-amber-400" />
              折扣中心
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              獨家 <span className="text-amber-500">折扣優惠</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              使用我們的專屬折扣碼，以最低成本開啟您的 Prop Firm 交易之旅。
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mb-1">{PROP_FIRM_DISCOUNTS.length}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">專屬優惠</div>
            </div>
            <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">最高50%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">折扣優惠</div>
            </div>
            <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">即時</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">立即使用</div>
            </div>
            <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">每週</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">更新優惠</div>
            </div>
          </div>
        </div>

        {/* Table Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">排名</div>
          <div className="col-span-4">Firm 名稱 / 評價</div>
          <div className="col-span-3">折扣優惠</div>
          <div className="col-span-2">優惠碼</div>
          <div className="col-span-2 text-right">操作</div>
        </div>

        {/* Discount List */}
        <div className="flex flex-col gap-4">
          {PROP_FIRM_DISCOUNTS.map(firm => (
            <PropFirmDiscountRow key={firm.id} firm={firm} />
          ))}
        </div>
      </div>
    </section>
  );
}
