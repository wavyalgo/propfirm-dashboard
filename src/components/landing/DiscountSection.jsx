import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { PROP_FIRM_DISCOUNTS } from '../../data/discounts';
import PropFirmDiscountRow from './PropFirmDiscountRow';

export default function DiscountSection() {
  const [activeCategory, setActiveCategory] = useState('期貨');

  // Filter discounts by category
  const filteredDiscounts = PROP_FIRM_DISCOUNTS.filter(
    discount => discount.category === activeCategory
  );

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

          {/* Category Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 gap-2">
              <button
                onClick={() => setActiveCategory('期貨')}
                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeCategory === '期貨'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                期貨
              </button>
              <button
                onClick={() => setActiveCategory('CFD外匯')}
                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeCategory === 'CFD外匯'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                CFD外匯
              </button>
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
          {filteredDiscounts.length > 0 ? (
            filteredDiscounts.map(firm => (
              <PropFirmDiscountRow key={firm.id} firm={firm} />
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              此類別暫無優惠
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
