import React from 'react';
import { Edit2, Trash2, BarChart3, MoreHorizontal } from 'lucide-react';

const TransactionTable = ({ data, onEdit, onDelete }) => {
    return (
        <div className="w-full glass-card rounded-3xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">交易明細</h3>
                </div>
                <button className="text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.04]">
                            <th className="px-8 py-5">經紀商 / 日期</th>
                            <th className="px-8 py-5">帳戶詳情</th>
                            <th className="px-8 py-5 text-right">成本</th>
                            <th className="px-8 py-5 text-right">收益</th>
                            <th className="px-8 py-5 text-right">淨利潤</th>
                            <th className="px-8 py-5 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {data.map((item) => {
                            const cost = Math.abs(item.cost);
                            const netProfit = item.revenue - cost;
                            return (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-5 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border ${item.firm === 'FNF' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {item.firm.substring(0, 2)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {item.nickname ? `${item.nickname} ${item.firm}` : item.firm}
                                                </span>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5">{item.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 align-middle">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{item.size}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${item.phase === 'Legacy' || item.phase === 'Select' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>{item.phase}</span>
                                            </div>
                                            <span className={`text-xs inline-flex w-fit items-center gap-1 ${item.category === '期貨' ? 'text-amber-500 dark:text-amber-400' : 'text-cyan-500 dark:text-cyan-400'}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right align-middle">
                                        <span className="font-mono text-rose-500 dark:text-rose-400">-${cost.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right align-middle">
                                        <span className={`font-mono font-bold ${item.revenue > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                            {item.revenue > 0 ? '+' : ''}${item.revenue.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right align-middle">
                                        <span className={`font-mono font-bold ${netProfit > 0 ? 'text-emerald-500 dark:text-emerald-400' : netProfit < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                            {netProfit > 0 ? '+' : ''}${netProfit.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right align-middle">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-16 text-center text-slate-500 dark:text-slate-500">沒有符合篩選條件的紀錄。</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default TransactionTable;
