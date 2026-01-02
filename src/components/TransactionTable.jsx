import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Edit2, Trash2, BarChart3, MoreHorizontal, Filter, ChevronDown } from 'lucide-react';
import { normalizeStatus } from '../utils/helpers';

const TransactionTable = ({ data, onEdit, onDelete, accountTypes = [], accountStages = [], accountStatuses = [] }) => {
    const [hiddenStatuses, setHiddenStatuses] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);
    const [expandedStatusRows, setExpandedStatusRows] = useState([]);
    const filterRef = useRef(null);

    // 点击外部关闭下拉菜单 - Fixed memory leak
    const handleClickOutside = useCallback((event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isFilterOpen, handleClickOutside]);

    // 所有可能的账户状态
    const allStatuses = useMemo(() => {
        if (accountStatuses.length > 0) {
            return accountStatuses.map(s => typeof s === 'string' ? s : s.name);
        }
        return ['Active', 'Passed', 'Suspended', 'Failed', 'Withdrawn'];
    }, [accountStatuses]);

    // 过滤后的数据（仅用于显示，不影响父组件的计算）
    const displayData = useMemo(() => {
        let filtered = data;

        // 過濾帳戶狀態
        if (hiddenStatuses.length > 0) {
            filtered = filtered.filter(item => !hiddenStatuses.includes(item.accountStatus));
        }

        return filtered;
    }, [data, hiddenStatuses]);

    // H6: 預先計算每個經紀商的帳戶編號映射，避免在 render loop 中重複計算
    const firmAccountNumberMap = useMemo(() => {
        const firmGroups = {};
        // 按經紀商分組
        displayData.forEach(item => {
            if (!firmGroups[item.firm]) {
                firmGroups[item.firm] = [];
            }
            firmGroups[item.firm].push(item);
        });
        // 為每個經紀商內的帳戶按日期排序並分配編號
        const numberMap = {};
        Object.keys(firmGroups).forEach(firm => {
            const sorted = firmGroups[firm].sort((a, b) => new Date(a.date) - new Date(b.date));
            sorted.forEach((item, index) => {
                numberMap[item.id] = index + 1;
            });
        });
        return numberMap;
    }, [displayData]);

    const toggleStatusFilter = (status) => {
        setHiddenStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const toggleRowExpand = (id) => {
        setExpandedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const toggleStatusExpand = (id) => {
        setExpandedStatusRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const getAccountTypeConfig = (phaseName) => {
        // 輔助函數：在 phase 數據中搜索配置
        const findConfigInPhase = (phaseData) => {
            if (!phaseData) return null;
            if (Array.isArray(phaseData)) {
                // 新數組格式：[{ id: 'item-xxx', name: 'xxx', config: {...} }, ...]
                const found = phaseData.find(item => item.name === phaseName);
                if (found?.config) return found.config;
            } else if (phaseData.name === phaseName && phaseData.config) {
                // 舊單對象格式：{ name: 'xxx', config: {...} }
                return phaseData.config;
            }
            return null;
        };

        for (const type of accountTypes) {
            if (typeof type === 'string') {
                // 舊格式：字符串，無配置
                continue;
            } else if (type.name === phaseName && type.config) {
                // 舊對象格式：{ name: 'xxx', config: {...} }
                return type.config;
            } else if (type.id) {
                // 新分組格式：{ id: 'group-xxx', phase1: [...], phase2: [...], funded: [...] }
                const config = findConfigInPhase(type.phase1) ||
                               findConfigInPhase(type.phase2) ||
                               findConfigInPhase(type.funded);
                if (config) return config;
            }
        }
        return null;
    };

    // 獲取有效的賬戶狀態（優先使用最新的帳戶紀錄）
    const getEffectiveAccountStatus = (item) => {
        if (!item.accountRecords || item.accountRecords.length === 0) {
            return normalizeStatus(item.accountStatus);
        }

        // 按日期降序排序，日期相同時後添加的記錄優先（索引大的優先）
        const recordsWithIndex = item.accountRecords.map((record, index) => ({ ...record, _index: index }));
        const sortedRecords = recordsWithIndex.sort((a, b) => {
            const dateDiff = new Date(b.date) - new Date(a.date);
            if (dateDiff !== 0) return dateDiff;
            return b._index - a._index; // 日期相同時，後添加的優先
        });

        const latestRecord = sortedRecords[0];

        // 如果最新記錄有狀態，使用它（無論是否衝突）
        if (latestRecord.status) {
            return normalizeStatus(latestRecord.status);
        }

        // 否則使用主要的賬戶狀態
        return normalizeStatus(item.accountStatus);
    };

    // 獲取有效的賬戶種類（優先使用最新的帳戶紀錄）
    const getEffectiveAccountType = (item) => {
        if (!item.accountRecords || item.accountRecords.length === 0) {
            return item.phase;
        }

        // 按日期降序排序，日期相同時後添加的記錄優先（索引大的優先）
        const recordsWithIndex = item.accountRecords.map((record, index) => ({ ...record, _index: index }));
        const sortedRecords = recordsWithIndex.sort((a, b) => {
            const dateDiff = new Date(b.date) - new Date(a.date);
            if (dateDiff !== 0) return dateDiff;
            return b._index - a._index; // 日期相同時，後添加的優先
        });

        const latestRecord = sortedRecords[0];

        // 如果最新記錄有賬戶種類 (type 字段)，使用它（無論是否衝突）
        if (latestRecord.type) {
            return latestRecord.type;
        }

        // 否則使用主要的賬戶種類
        return item.phase;
    };

    const getStatusColor = (status) => {
        // 先從 accountStatuses 中查找配置的顏色
        const statusConfig = accountStatuses.find(s =>
            (typeof s === 'string' ? s : s.name) === status
        );

        if (statusConfig && typeof statusConfig === 'object' && statusConfig.color) {
            const colorMap = {
                'slate': 'text-slate-600 dark:text-slate-400',
                'red': 'text-red-600 dark:text-red-400',
                'orange': 'text-orange-600 dark:text-orange-400',
                'amber': 'text-amber-600 dark:text-amber-400',
                'yellow': 'text-yellow-600 dark:text-yellow-400',
                'lime': 'text-lime-600 dark:text-lime-400',
                'emerald': 'text-emerald-600 dark:text-emerald-400',
                'teal': 'text-teal-600 dark:text-teal-400',
                'cyan': 'text-cyan-600 dark:text-cyan-400',
                'blue': 'text-blue-600 dark:text-blue-400',
                'indigo': 'text-indigo-600 dark:text-indigo-400',
                'violet': 'text-violet-600 dark:text-violet-400',
                'purple': 'text-purple-600 dark:text-purple-400',
                'pink': 'text-pink-600 dark:text-pink-400',
            };
            return colorMap[statusConfig.color] || 'text-slate-600 dark:text-slate-400';
        }

        // 默認顏色
        switch(status) {
            case 'Active': return 'text-emerald-600 dark:text-emerald-400';
            case 'Passed': return 'text-blue-600 dark:text-blue-400';
            case 'Suspended': return 'text-amber-600 dark:text-amber-400';
            case 'Failed': return 'text-rose-600 dark:text-rose-400';
            case 'Withdrawn': return 'text-slate-600 dark:text-slate-400';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    return (
        <div className="w-full glass-card rounded-3xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">賬戶詳情</h3>
                    {hiddenStatuses.length > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            已隱藏 {hiddenStatuses.length} 個篩選條件
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Filter 按鈕 */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-2 rounded-lg transition-colors ${
                                hiddenStatuses.length > 0
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-400 hover:text-indigo-500 dark:hover:text-white'
                            }`}
                            title="過濾條件"
                        >
                            <Filter className="w-5 h-5" />
                        </button>

                        {/* Filter 下拉菜单 */}
                        {isFilterOpen && (
                            <div className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl py-2">
                                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">隱藏帳戶狀態</p>
                                </div>
                                <div className="py-2">
                                    {allStatuses.map(status => (
                                        <label
                                            key={status}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hiddenStatuses.includes(status)}
                                                onChange={() => toggleStatusFilter(status)}
                                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                                            />
                                            <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                                                {status}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {hiddenStatuses.length > 0 && (
                                    <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => setHiddenStatuses([])}
                                            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors"
                                        >
                                            清除所有過濾
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.04]">
                            <th className="px-4 py-5 whitespace-nowrap">經紀商 / 日期</th>
                            <th className="px-4 py-5 whitespace-nowrap">賬戶類型</th>
                            <th className="px-4 py-5 whitespace-nowrap">賬戶規模</th>
                            <th className="px-4 py-5 whitespace-nowrap">賬戶種類</th>
                            <th className="px-4 py-5 whitespace-nowrap">賬戶階段</th>
                            <th className="px-4 py-5 text-right whitespace-nowrap">成本</th>
                            <th className="px-4 py-5 text-right whitespace-nowrap">收益</th>
                            <th className="px-4 py-5 text-right whitespace-nowrap">淨利潤</th>
                            <th className="px-4 py-5 text-center whitespace-nowrap">帳戶狀態</th>
                            <th className="px-4 py-5 text-center whitespace-nowrap">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {displayData.map((item) => {
                            const cost = Math.abs(item.cost);
                            const netProfit = item.revenue - cost;

                            // 使用預計算的帳戶編號映射 (H6 效能優化)
                            const accountNumber = firmAccountNumberMap[item.id] || 1;
                            const firmDisplayName = `${item.firm} ${accountNumber}`;

                            return (
                                <React.Fragment key={item.id}>
                                <tr className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-5 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border ${item.firm === 'FNF' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {item.firm.substring(0, 2)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                    {firmDisplayName}
                                                </span>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5 whitespace-nowrap">{item.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Propfirm 類型 */}
                                    <td className="px-4 py-5 align-middle">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                            item.category === '期貨'
                                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                                        }`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    {/* 賬戶規模 */}
                                    <td className="px-4 py-5 align-middle">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.size}</span>
                                    </td>
                                    {/* 賬戶種類 */}
                                    <td className="px-4 py-5 align-middle">
                                        {(() => {
                                            const effectiveType = getEffectiveAccountType(item);
                                            const config = getAccountTypeConfig(effectiveType);
                                            const colorValue = config?.color || '';

                                            // 根據配置的顏色獲取樣式
                                            const getColorStyles = (color) => {
                                                const colorMap = {
                                                    'red': 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20 hover:bg-red-500/20',
                                                    'orange': 'bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/20 hover:bg-orange-500/20',
                                                    'amber': 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20 hover:bg-amber-500/20',
                                                    'yellow': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 border-yellow-500/20 hover:bg-yellow-500/20',
                                                    'lime': 'bg-lime-500/10 text-lime-600 dark:text-lime-300 border-lime-500/20 hover:bg-lime-500/20',
                                                    'emerald': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20',
                                                    'teal': 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20 hover:bg-teal-500/20',
                                                    'cyan': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20',
                                                    'blue': 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20 hover:bg-blue-500/20',
                                                    'indigo': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20',
                                                    'violet': 'bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20 hover:bg-violet-500/20',
                                                    'purple': 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20 hover:bg-purple-500/20',
                                                    'pink': 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/20 hover:bg-pink-500/20',
                                                };
                                                return colorMap[color] || 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
                                            };

                                            return (
                                                <button
                                                    onClick={() => toggleRowExpand(item.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${getColorStyles(colorValue)}`}
                                                >
                                                    {effectiveType}
                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedRows.includes(item.id) ? 'rotate-180' : ''}`} />
                                                </button>
                                            );
                                        })()}
                                    </td>
                                    {/* 賬戶階段 */}
                                    <td className="px-4 py-5 align-middle">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {item.accountStage || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-right align-middle">
                                        <span className="font-mono text-rose-500 dark:text-rose-400">-${cost.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-5 text-right align-middle">
                                        <span className={`font-mono font-bold whitespace-nowrap ${item.revenue > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                            {item.revenue > 0 ? '+' : ''}${item.revenue.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-right align-middle">
                                        <span className={`font-mono font-bold ${netProfit > 0 ? 'text-emerald-500 dark:text-emerald-400' : netProfit < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                            {netProfit > 0 ? '+' : ''}${netProfit.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-center align-middle">
                                        {(() => {
                                            const effectiveStatus = getEffectiveAccountStatus(item);
                                            return effectiveStatus ? (
                                                <button
                                                    onClick={() => toggleStatusExpand(item.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all whitespace-nowrap ${
                                                        effectiveStatus === 'Active'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                                            : effectiveStatus === 'Passed'
                                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
                                                            : effectiveStatus === 'Suspended'
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                                            : effectiveStatus === 'Failed'
                                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                                            : effectiveStatus === 'Withdrawn'
                                                            ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    {effectiveStatus}
                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedStatusRows.includes(item.id) ? 'rotate-180' : ''}`} />
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-600 text-xs">-</span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-4 py-5 text-center align-middle">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* 展開的配置參數面板 */}
                                {expandedRows.includes(item.id) && (() => {
                                    const effectiveType = getEffectiveAccountType(item);
                                    const config = getAccountTypeConfig(effectiveType);
                                    if (!config || Object.keys(config).length === 0) {
                                        return (
                                            <tr>
                                                <td colSpan={10} className="px-8 py-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.04]">
                                                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                                        此賬戶種類 ({effectiveType}) 尚未配置參數
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr>
                                            <td colSpan={10} className="px-8 py-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.04]">
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {config.drawdownType && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">回撤類型</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.drawdownType}</div>
                                                        </div>
                                                    )}
                                                    {config.maxDrawdown && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">最大回撤</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.maxDrawdown}</div>
                                                        </div>
                                                    )}
                                                    {config.dailyDrawdown && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">每日回撤</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.dailyDrawdown}</div>
                                                        </div>
                                                    )}
                                                    {config.profitTarget && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">利潤目標</div>
                                                            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{config.profitTarget}</div>
                                                        </div>
                                                    )}
                                                    {config.tradingDaysRequired && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">所需交易天數</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.tradingDaysRequired}</div>
                                                        </div>
                                                    )}
                                                    {config.minimumProfitAmount && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">最低利潤金額</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.minimumProfitAmount}</div>
                                                        </div>
                                                    )}
                                                    {config.consistency && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">一致性要求</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.consistency}</div>
                                                        </div>
                                                    )}
                                                    {config.maxContracts && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">最大合約數</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.maxContracts}</div>
                                                        </div>
                                                    )}
                                                    {config.maxPayout && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">最大出金</div>
                                                            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{config.maxPayout}</div>
                                                        </div>
                                                    )}
                                                    {config.payoutFrequency && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">出金頻率</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{config.payoutFrequency}</div>
                                                        </div>
                                                    )}
                                                    {config.newsTrading && (
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">新聞交易</div>
                                                            <div className={`text-sm font-medium ${config.newsTrading === '允許' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{config.newsTrading}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                {config.notes && (
                                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
                                                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">備註</div>
                                                        <div className="text-sm text-slate-700 dark:text-slate-300">{config.notes}</div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })()}

                                {/* 展開的賬戶紀錄面板 */}
                                {expandedStatusRows.includes(item.id) && (() => {
                                    const accountRecords = item.accountRecords || [];
                                    if (accountRecords.length === 0) {
                                        return (
                                            <tr>
                                                <td colSpan={10} className="px-8 py-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.04]">
                                                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                                        此賬戶尚無紀錄
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr>
                                            <td colSpan={10} className="px-8 py-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.04]">
                                                <div className="space-y-3">
                                                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">帳戶紀錄歷史</div>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-400">日期</th>
                                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-400">賬戶狀態</th>
                                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-400">帳戶種類</th>
                                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-400">帳戶號碼</th>
                                                                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-400">額外成本</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                                {accountRecords.map((record, idx) => {
                                                                    const recordStatus = normalizeStatus(record.status);
                                                                    return (
                                                                    <tr key={record.id || `record-${idx}`} className="hover:bg-slate-100 dark:hover:bg-white/[0.02]">
                                                                        <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-mono text-xs">{record.date}</td>
                                                                        <td className="py-2 px-3">
                                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                                recordStatus === 'Active'
                                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                                    : recordStatus === 'Passed'
                                                                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                                    : recordStatus === 'Suspended'
                                                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                                                    : recordStatus === 'Failed'
                                                                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                                                    : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                                                            }`}>
                                                                                {recordStatus}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{record.type}</td>
                                                                        <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-mono text-xs">{record.number || '-'}</td>
                                                                        <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300 font-mono">
                                                                            {record.extraCost > 0 ? `-$${Number(record.extraCost).toLocaleString()}` : '-'}
                                                                        </td>
                                                                    </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })()}
                                </React.Fragment>
                            );
                        })}
                        {displayData.length === 0 && (
                            <tr>
                                <td colSpan={10} className="px-8 py-16 text-center text-slate-500 dark:text-slate-500">
                                    {data.length === 0 ? '沒有符合篩選條件的紀錄。' : '所有交易已被過濾器隱藏。'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default TransactionTable;
