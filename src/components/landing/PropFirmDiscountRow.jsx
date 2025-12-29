import React, { useState } from 'react';
import { Star, Copy, Check, ExternalLink } from 'lucide-react';

const PropFirmDiscountRow = ({ firm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(firm.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorClasses = {
    emerald: {
      logoBg: 'bg-emerald-500',
      border: 'hover:border-emerald-500/50',
      shadow: 'hover:shadow-emerald-500/10'
    },
    blue: {
      logoBg: 'bg-blue-500',
      border: 'hover:border-blue-500/50',
      shadow: 'hover:shadow-blue-500/10'
    },
    purple: {
      logoBg: 'bg-purple-500',
      border: 'hover:border-purple-500/50',
      shadow: 'hover:shadow-purple-500/10'
    },
    indigo: {
      logoBg: 'bg-indigo-500',
      border: 'hover:border-indigo-500/50',
      shadow: 'hover:shadow-indigo-500/10'
    },
    amber: {
      logoBg: 'bg-amber-500',
      border: 'hover:border-amber-500/50',
      shadow: 'hover:shadow-amber-500/10'
    }
  };

  const colors = colorClasses[firm.color];

  return (
    <div className={`group bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 ${colors.border} transition-all duration-300 ${colors.shadow} hover:shadow-lg hover:-translate-y-1 p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-hidden`}>
      {/* Decorative Left Border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.logoBg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

      {/* Rank & Firm Name (Col Span 4) */}
      <div className="md:col-span-4 flex items-center gap-4 pl-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-sm font-black text-slate-600 dark:text-slate-400">#{firm.rank}</span>
        </div>
        <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md ${colors.logoBg} font-black text-white text-sm group-hover:scale-110 transition-transform`}>
          {firm.logo}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {firm.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{firm.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({firm.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Discount Offer (Col Span 3) */}
      <div className="md:col-span-3 md:border-l border-slate-200 dark:border-slate-700 md:pl-6">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Special Offer</p>
        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
          {firm.discount}
        </p>
      </div>

      {/* Promo Code (Col Span 3) */}
      <div className="md:col-span-3 md:pr-2">
        <div className="flex items-stretch h-10">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-l-md border border-r-0 border-slate-200 dark:border-slate-700 flex items-center justify-center px-3">
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm tracking-wide select-all">
              {firm.code}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 rounded-r-md font-semibold text-xs transition-all duration-200 flex items-center gap-2 min-w-[80px] justify-center
              ${copied
                ? 'bg-green-600 text-white'
                : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600'
              }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                已複製
              </>
            ) : (
              <>
                <Copy size={14} />
                複製
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Button (Col Span 2) */}
      <div className="md:col-span-2 flex justify-end">
        <a
          href={firm.link}
          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:gap-2 transition-all group/link"
        >
          查看優惠
          <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default PropFirmDiscountRow;
