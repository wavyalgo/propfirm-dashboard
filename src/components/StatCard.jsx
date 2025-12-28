import React from 'react';

const StatCard = ({ title, value, prefix = "", suffix = "", icon, color, trend, trendUp }) => (
    <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-emerald-500/10"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 ${color} group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-300`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            {trend && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'} ${trend === 'All time' ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' : ''}`}>
                    {trend}
                </span>
            )}
        </div>
        <div className="space-y-1 relative z-10">
            <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-slate-500">{prefix}</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">{value.toLocaleString()}</h3>
                <span className="text-sm font-medium text-slate-500">{suffix}</span>
            </div>
        </div>
    </div>
);

export default StatCard;
