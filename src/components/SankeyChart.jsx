import React, { useMemo, useState } from 'react';
import { normalizeStatus } from '../utils/helpers';

const SankeyChart = ({ data }) => {
    const [expandedAccounts, setExpandedAccounts] = useState([]);

    // 切換賬戶展開狀態（支持多選）
    const toggleAccountExpand = (accountKey) => {
        setExpandedAccounts(prev =>
            prev.includes(accountKey)
                ? prev.filter(key => key !== accountKey)
                : [...prev, accountKey]
        );
    };

    // Process data to group by firm + account stage combination
    const processedData = useMemo(() => {
        const combinationMap = new Map();

        data.forEach((item, index) => {
            const firm = item.firm || '未知';
            const accountStage = item.accountStage || '未知';
            const category = item.category || '期貨';
            const combination = `${firm}-${accountStage}`;
            const accountId = `${firm.substring(0, 1)}${index + 1}`;
            const hasPayouts = item.payouts && item.payouts.length > 0;
            const payoutCount = hasPayouts ? item.payouts.length : 0;
            const accountRecords = item.accountRecords || [];

            if (!combinationMap.has(combination)) {
                combinationMap.set(combination, {
                    firm,
                    accountStage,
                    category,
                    accounts: []
                });
            }

            combinationMap.get(combination).accounts.push({
                id: accountId,
                accountStatus: normalizeStatus(item.accountStatus) || 'Active',
                hasPayouts,
                payoutCount,
                accountRecords,
                payouts: item.payouts || [],
                baseCost: item.baseCost || 0
            });
        });

        return Array.from(combinationMap.values());
    }, [data]);

    // Determine max phases across all combinations
    const maxPhases = useMemo(() => {
        let max = 0;
        processedData.forEach(combo => {
            combo.accounts.forEach(account => {
                const recordCount = account.accountRecords.length;
                if (recordCount > max) max = recordCount;
            });
        });
        return max;
    }, [processedData]);

    // Get color for combination (cycle through 12 colors for better variety)
    const getColor = (index) => {
        const colors = [
            { border: 'border-emerald-500', bg: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
            { border: 'border-blue-500', bg: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
            { border: 'border-purple-500', bg: 'bg-purple-500', light: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
            { border: 'border-cyan-500', bg: 'bg-cyan-500', light: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
            { border: 'border-pink-500', bg: 'bg-pink-500', light: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
            { border: 'border-amber-500', bg: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
            { border: 'border-indigo-500', bg: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
            { border: 'border-teal-500', bg: 'bg-teal-500', light: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
            { border: 'border-rose-500', bg: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' },
            { border: 'border-orange-500', bg: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
            { border: 'border-lime-500', bg: 'bg-lime-500', light: 'bg-lime-50 dark:bg-lime-500/10', text: 'text-lime-600 dark:text-lime-400', badge: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300' },
            { border: 'border-violet-500', bg: 'bg-violet-500', light: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
        ];
        return colors[index % colors.length];
    };

    // Process accounts by phase for a given combination
    const processAccountsByPhase = (accounts, accountStage) => {
        const phases = [];

        // Determine if this is an instant funding model (即時資金) - 基於賬戶階段名稱
        const isInstantFunding = accountStage?.includes('即時資金');

        if (isInstantFunding) {
            // For instant funding, no evaluation phases, go straight to funded
            phases.push(null); // Phase 1 skipped
            if (maxPhases > 1) phases.push(null); // Phase 2 skipped if exists

            // Funded phase
            const funded = {
                created: [],
                active: [],
                passed: [],
                failed: [],
                suspended: [],
                withdrawn: []
            };

            accounts.forEach(account => {
                funded.created.push(account);
                const status = normalizeStatus(account.accountStatus).toLowerCase();
                if (status === 'active') funded.active.push(account);
                else if (status === 'passed') funded.passed.push(account);
                else if (status === 'failed') funded.failed.push(account);
                else if (status === 'suspended') funded.suspended.push(account);
                else if (status === 'withdrawn') funded.withdrawn.push(account);
            });

            phases.push(funded);
        } else {
            // For challenge models, process by account records
            for (let phaseIndex = 0; phaseIndex <= maxPhases; phaseIndex++) {
                const phaseData = {
                    created: [],
                    active: [],
                    passed: [],
                    failed: [],
                    suspended: [],
                    withdrawn: []
                };

                accounts.forEach(account => {
                    if (phaseIndex === 0) {
                        // Initial phase - all created accounts
                        phaseData.created.push(account);

                        if (account.accountRecords.length === 0) {
                            // No records yet, use accountStatus
                            const status = normalizeStatus(account.accountStatus).toLowerCase();
                            if (status === 'active') phaseData.active.push(account);
                        } else if (account.accountRecords?.length > 0) {
                            // Has records, check first record
                            const firstRecord = account.accountRecords[0];
                            const status = normalizeStatus(firstRecord?.status).toLowerCase();
                            if (status === 'active') phaseData.active.push(account);
                            else if (status === 'passed') phaseData.passed.push(account);
                            else if (status === 'failed') phaseData.failed.push(account);
                            else if (status === 'suspended') phaseData.suspended.push(account);
                        }
                    } else if (phaseIndex <= maxPhases && phaseIndex < account.accountRecords.length + 1) {
                        // Subsequent phases based on account records
                        const recordIndex = phaseIndex - 1;

                        if (recordIndex < account.accountRecords.length) {
                            const record = account.accountRecords[recordIndex];
                            const status = normalizeStatus(record?.status).toLowerCase();

                            // Upgraded from previous phase
                            const prevRecord = account.accountRecords[recordIndex - 1];
                            if (recordIndex === 0 || normalizeStatus(prevRecord?.status).toLowerCase() === 'passed') {
                                phaseData.created.push(account);
                            }

                            if (status === 'active') phaseData.active.push(account);
                            else if (status === 'passed') phaseData.passed.push(account);
                            else if (status === 'failed') phaseData.failed.push(account);
                            else if (status === 'suspended') phaseData.suspended.push(account);
                        } else if (phaseIndex === maxPhases && account.accountRecords?.length > 0) {
                            // Funded phase - check if passed all previous phases
                            const lastRecord = account.accountRecords[account.accountRecords.length - 1];
                            if (normalizeStatus(lastRecord?.status).toLowerCase() === 'passed') {
                                phaseData.created.push(account);
                                phaseData.active.push(account);
                            }
                        }
                    }
                });

                phases.push(phaseData);
            }
        }

        return phases;
    };

    if (processedData.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-slate-500 dark:text-slate-400">
                沒有帳戶數據可顯示
            </div>
        );
    }

    // Column count: maxPhases + 1 for funded
    const columnCount = Math.max(3, maxPhases + 1);

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
                {/* Timeline Headers */}
                <div className={`grid gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4`}
                    style={{ gridTemplateColumns: `200px repeat(${columnCount}, 1fr)` }}>
                    <div className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider pl-2">
                        Firm / Model
                    </div>
                    {Array.from({ length: columnCount }, (_, i) => {
                        let label = '';
                        if (i < maxPhases) {
                            label = `Phase ${i + 1}`;
                        } else {
                            label = 'Funded & Payouts';
                        }
                        return (
                            <div key={i} className={`font-bold text-xs uppercase tracking-wider ${i === columnCount - 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                                {label}
                            </div>
                        );
                    })}
                </div>

                {/* Combination Rows */}
                {processedData.map((combo, comboIndex) => {
                    const colors = getColor(comboIndex);
                    const isInstantFunding = combo.accountStage.includes('即時資金');
                    const phases = processAccountsByPhase(combo.accounts, combo.accountStage);
                    const totalAccounts = combo.accounts.length;

                    return (
                        <div key={comboIndex}
                            className={`grid gap-4 mb-6 group`}
                            style={{ gridTemplateColumns: `200px repeat(${columnCount}, 1fr)` }}>

                            {/* Firm + Stage Sidebar */}
                            <div className={`flex flex-col justify-center border-l-4 ${colors.border} pl-4 py-2 ${colors.light} rounded-r-xl`}>
                                <div className="font-bold text-slate-800 dark:text-white text-lg">
                                    {combo.firm}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${colors.text} mt-1`}>
                                    {combo.accountStage}
                                </span>
                            </div>

                            {/* Phase Columns */}
                            {Array.from({ length: columnCount }, (_, phaseIndex) => {
                                // Check if this is a 1-phase challenge (1階挑戰) - skip Phase 2
                                const isOnePhaseChallenge = combo.accountStage.includes('1階');

                                // For instant funding, skip phase 1 and 2
                                if (isInstantFunding && phaseIndex < columnCount - 1) {
                                    return (
                                        <div key={phaseIndex} className={`relative h-full flex items-center justify-center bg-slate-50/30 dark:bg-slate-800/20 rounded-xl border-2 border-dashed ${colors.border}/20`}>
                                            <div className={`z-10 ${colors.badge} text-xs font-bold px-3 py-1 rounded-full border ${colors.border}/20`}>
                                                {phaseIndex === 0 && columnCount > 2 ? '⏩ Skipped' : 'Skipped'}
                                            </div>
                                        </div>
                                    );
                                }

                                // For 1-phase challenge, skip Phase 2 (phaseIndex === 1)
                                if (isOnePhaseChallenge && phaseIndex === 1 && columnCount > 2) {
                                    return (
                                        <div key={phaseIndex} className={`relative h-full flex items-center justify-center bg-slate-50/30 dark:bg-slate-800/20 rounded-xl border-2 border-dashed ${colors.border}/20`}>
                                            <div className={`z-10 ${colors.badge} text-xs font-bold px-3 py-1 rounded-full border ${colors.border}/20`}>
                                                ⏩ Skipped
                                            </div>
                                        </div>
                                    );
                                }

                                const phaseData = phases[phaseIndex];

                                if (!phaseData || (phaseData.created.length === 0 && phaseData.active.length === 0 && phaseData.passed.length === 0 && phaseData.failed.length === 0)) {
                                    return (
                                        <div key={phaseIndex} className="relative h-full flex items-center justify-center bg-slate-50/30 dark:bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700/50">
                                            <div className="text-xs text-slate-400 dark:text-slate-600 italic">
                                                無帳戶
                                            </div>
                                        </div>
                                    );
                                }

                                const isFundedPhase = phaseIndex === columnCount - 1;

                                return (
                                    <div key={phaseIndex} className={`bg-white dark:bg-slate-800/50 border ${isFundedPhase ? colors.border : 'border-slate-200 dark:border-slate-700'} ${isFundedPhase ? colors.light : ''} rounded-xl p-3 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}>
                                        {/* Phase Title */}
                                        <div className={`text-xs font-bold mb-3 border-b pb-1 ${isFundedPhase ? `${colors.text} ${colors.border}/20` : 'text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'}`}>
                                            {phaseIndex < maxPhases ? `Phase ${phaseIndex + 1}` : 'Funded Status'}
                                        </div>

                                        {/* Created (All Accounts in this phase) */}
                                        {phaseData.created.length > 0 && (
                                            <div className={`mb-3 border-b ${isFundedPhase ? `${colors.border}/10` : 'border-slate-50 dark:border-slate-800'} pb-2`}>
                                                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
                                                    {phaseIndex === 0 ? '已創建' : phaseIndex < maxPhases ? '升級至此' : '已獲資金'} ({phaseData.created.length})
                                                </div>
                                                <div className="flex flex-wrap gap-1 opacity-60">
                                                    {phaseData.created.slice(0, 8).map((account, idx) => (
                                                        <span key={idx} className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            {account.id}
                                                        </span>
                                                    ))}
                                                    {phaseData.created.length > 8 && (
                                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 px-1">
                                                            +{phaseData.created.length - 8}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Active */}
                                        {phaseData.active.length > 0 && (
                                            <div className="mb-3">
                                                <div className="text-[10px] font-bold uppercase tracking-wide mb-1.5 flex items-center">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isFundedPhase ? colors.bg.replace('bg-', 'bg-') : 'bg-amber-500 dark:bg-amber-400'} animate-pulse mr-1.5`}></span>
                                                    <span className={isFundedPhase ? colors.text : 'text-amber-500 dark:text-amber-400'}>
                                                        活躍中 ({phaseData.active.length})
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    {phaseData.active.map((account, idx) => {
                                                        const accountKey = `${combo.firm}-${account.id}-active-${phaseIndex}`;
                                                        const isExpanded = expandedAccounts.includes(accountKey);
                                                        return (
                                                            <div key={idx}>
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        onClick={() => toggleAccountExpand(accountKey)}
                                                                        className={`${colors.bg} text-white text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                                                                        title="點擊查看帳戶紀錄"
                                                                    >
                                                                        {account.id} {isExpanded ? '▼' : '▶'}
                                                                    </button>
                                                                    {isFundedPhase && account.hasPayouts && (
                                                                        <span className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                                                            {account.payoutCount} 出金
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isExpanded && !isFundedPhase && account.accountRecords && account.accountRecords.length > 0 && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px]">
                                                                        <div className="font-bold text-slate-600 dark:text-slate-300 mb-2">帳戶紀錄歷史</div>
                                                                        <table className="w-full">
                                                                            <thead>
                                                                                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                                                                                    <th className="text-left py-1 px-1">日期</th>
                                                                                    <th className="text-left py-1 px-1">狀態</th>
                                                                                    <th className="text-left py-1 px-1">種類</th>
                                                                                    <th className="text-left py-1 px-1">帳號</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {account.accountRecords.map((record, rIdx) => (
                                                                                    <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-700/50">
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.date}</td>
                                                                                        <td className="py-1 px-1">
                                                                                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                                                                                normalizeStatus(record.status) === 'Passed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                                                                                normalizeStatus(record.status) === 'Active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                                                                normalizeStatus(record.status) === 'Failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                                                                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                                                            }`}>
                                                                                                {normalizeStatus(record.status)}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300">{record.type || '-'}</td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.number || '-'}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                                {isExpanded && !isFundedPhase && (!account.accountRecords || account.accountRecords.length === 0) && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 italic">
                                                                        無帳戶紀錄
                                                                    </div>
                                                                )}
                                                                {/* Funded Phase - Show Payout Records */}
                                                                {isExpanded && isFundedPhase && (
                                                                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700 text-[10px]">
                                                                        <div className="font-bold text-emerald-600 dark:text-emerald-300 mb-2">出金紀錄</div>
                                                                        {account.payouts && account.payouts.length > 0 ? (
                                                                            <>
                                                                                <table className="w-full mb-2">
                                                                                    <thead>
                                                                                        <tr className="text-emerald-600 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-600">
                                                                                            <th className="text-left py-1 px-1">日期</th>
                                                                                            <th className="text-right py-1 px-1">金額</th>
                                                                                            <th className="text-center py-1 px-1">到賬</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {account.payouts.map((payout, pIdx) => (
                                                                                            <tr key={pIdx} className="border-b border-emerald-100 dark:border-emerald-700/50">
                                                                                                <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{payout.date}</td>
                                                                                                <td className="py-1 px-1 text-right text-emerald-600 dark:text-emerald-400 font-mono font-bold">+${Number(payout.amount || 0).toLocaleString()}</td>
                                                                                                <td className={`py-1 px-1 text-center font-bold ${payout.arrived === '是' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>{payout.arrived || '否'}</td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-600 flex justify-between items-center">
                                                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">累積收益:</span>
                                                                                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm">
                                                                                        ${account.payouts.reduce((sum, p) => p.arrived === '是' ? sum + Number(p.amount || 0) : sum, 0).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className="text-slate-500 italic">尚無出金紀錄</div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Passed */}
                                        {phaseData.passed.length > 0 && (
                                            <div className="mb-3">
                                                <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1.5">
                                                    已通過 ({phaseData.passed.length})
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    {phaseData.passed.map((account, idx) => {
                                                        const accountKey = `${combo.firm}-${account.id}-passed-${phaseIndex}`;
                                                        const isExpanded = expandedAccounts.includes(accountKey);
                                                        return (
                                                            <div key={idx}>
                                                                <button
                                                                    onClick={() => toggleAccountExpand(accountKey)}
                                                                    className={`${colors.bg} text-white text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                                                                    title={isFundedPhase ? "點擊查看出金紀錄" : "點擊查看帳戶紀錄"}
                                                                >
                                                                    {account.id} {isExpanded ? '▼' : '▶'}
                                                                </button>
                                                                {isExpanded && !isFundedPhase && account.accountRecords && account.accountRecords.length > 0 && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px]">
                                                                        <div className="font-bold text-slate-600 dark:text-slate-300 mb-2">帳戶紀錄歷史</div>
                                                                        <table className="w-full">
                                                                            <thead>
                                                                                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                                                                                    <th className="text-left py-1 px-1">日期</th>
                                                                                    <th className="text-left py-1 px-1">狀態</th>
                                                                                    <th className="text-left py-1 px-1">種類</th>
                                                                                    <th className="text-left py-1 px-1">帳號</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {account.accountRecords.map((record, rIdx) => (
                                                                                    <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-700/50">
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.date}</td>
                                                                                        <td className="py-1 px-1">
                                                                                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                                                                                normalizeStatus(record.status) === 'Passed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                                                                                normalizeStatus(record.status) === 'Active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                                                                normalizeStatus(record.status) === 'Failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                                                                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                                                            }`}>
                                                                                                {normalizeStatus(record.status)}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300">{record.type || '-'}</td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.number || '-'}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                                {isExpanded && !isFundedPhase && (!account.accountRecords || account.accountRecords.length === 0) && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 italic">
                                                                        無帳戶紀錄
                                                                    </div>
                                                                )}
                                                                {/* Funded Phase - Show Payout Records */}
                                                                {isExpanded && isFundedPhase && (
                                                                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700 text-[10px]">
                                                                        <div className="font-bold text-emerald-600 dark:text-emerald-300 mb-2">出金紀錄</div>
                                                                        {account.payouts && account.payouts.length > 0 ? (
                                                                            <>
                                                                                <table className="w-full mb-2">
                                                                                    <thead>
                                                                                        <tr className="text-emerald-600 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-600">
                                                                                            <th className="text-left py-1 px-1">日期</th>
                                                                                            <th className="text-right py-1 px-1">金額</th>
                                                                                            <th className="text-center py-1 px-1">到賬</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {account.payouts.map((payout, pIdx) => (
                                                                                            <tr key={pIdx} className="border-b border-emerald-100 dark:border-emerald-700/50">
                                                                                                <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{payout.date}</td>
                                                                                                <td className="py-1 px-1 text-right text-emerald-600 dark:text-emerald-400 font-mono font-bold">+${Number(payout.amount || 0).toLocaleString()}</td>
                                                                                                <td className={`py-1 px-1 text-center font-bold ${payout.arrived === '是' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>{payout.arrived || '否'}</td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-600 flex justify-between items-center">
                                                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">累積收益:</span>
                                                                                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm">
                                                                                        ${account.payouts.reduce((sum, p) => p.arrived === '是' ? sum + Number(p.amount || 0) : sum, 0).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className="text-slate-500 italic">尚無出金紀錄</div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Suspended */}
                                        {phaseData.suspended.length > 0 && (
                                            <div className="mb-3">
                                                <div className="text-[10px] font-bold uppercase tracking-wide text-orange-500 dark:text-orange-400 mb-1.5">
                                                    已暫停 ({phaseData.suspended.length})
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    {phaseData.suspended.map((account, idx) => {
                                                        const accountKey = `${combo.firm}-${account.id}-suspended-${phaseIndex}`;
                                                        const isExpanded = expandedAccounts.includes(accountKey);
                                                        return (
                                                            <div key={idx}>
                                                                <button
                                                                    onClick={() => toggleAccountExpand(accountKey)}
                                                                    className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                                                                    title="點擊查看帳戶紀錄"
                                                                >
                                                                    {account.id} {isExpanded ? '▼' : '▶'}
                                                                </button>
                                                                {isExpanded && account.accountRecords && account.accountRecords.length > 0 && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px]">
                                                                        <div className="font-bold text-slate-600 dark:text-slate-300 mb-2">帳戶紀錄歷史</div>
                                                                        <table className="w-full">
                                                                            <thead>
                                                                                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                                                                                    <th className="text-left py-1 px-1">日期</th>
                                                                                    <th className="text-left py-1 px-1">狀態</th>
                                                                                    <th className="text-left py-1 px-1">種類</th>
                                                                                    <th className="text-left py-1 px-1">帳號</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {account.accountRecords.map((record, rIdx) => (
                                                                                    <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-700/50">
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.date}</td>
                                                                                        <td className="py-1 px-1">
                                                                                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                                                                                normalizeStatus(record.status) === 'Passed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                                                                                normalizeStatus(record.status) === 'Active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                                                                normalizeStatus(record.status) === 'Failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                                                                normalizeStatus(record.status) === 'Suspended' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                                                                                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                                                            }`}>
                                                                                                {normalizeStatus(record.status)}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300">{record.type || '-'}</td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.number || '-'}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                                {isExpanded && (!account.accountRecords || account.accountRecords.length === 0) && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 italic">
                                                                        無帳戶紀錄
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Failed */}
                                        {phaseData.failed.length > 0 && (
                                            <div className="mb-3">
                                                <div className="text-[10px] font-bold uppercase tracking-wide text-red-400 dark:text-red-400 mb-1.5">
                                                    已失敗 ({phaseData.failed.length})
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    {phaseData.failed.map((account, idx) => {
                                                        const accountKey = `${combo.firm}-${account.id}-failed-${phaseIndex}`;
                                                        const isExpanded = expandedAccounts.includes(accountKey);
                                                        return (
                                                            <div key={idx}>
                                                                <button
                                                                    onClick={() => toggleAccountExpand(accountKey)}
                                                                    className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                                                                    title="點擊查看帳戶紀錄"
                                                                >
                                                                    {account.id} {isExpanded ? '▼' : '▶'}
                                                                </button>
                                                                {isExpanded && account.accountRecords && account.accountRecords.length > 0 && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px]">
                                                                        <div className="font-bold text-slate-600 dark:text-slate-300 mb-2">帳戶紀錄歷史</div>
                                                                        <table className="w-full">
                                                                            <thead>
                                                                                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                                                                                    <th className="text-left py-1 px-1">日期</th>
                                                                                    <th className="text-left py-1 px-1">狀態</th>
                                                                                    <th className="text-left py-1 px-1">種類</th>
                                                                                    <th className="text-left py-1 px-1">帳號</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {account.accountRecords.map((record, rIdx) => (
                                                                                    <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-700/50">
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.date}</td>
                                                                                        <td className="py-1 px-1">
                                                                                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                                                                                normalizeStatus(record.status) === 'Passed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                                                                                normalizeStatus(record.status) === 'Active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                                                                normalizeStatus(record.status) === 'Failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                                                                normalizeStatus(record.status) === 'Suspended' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                                                                                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                                                            }`}>
                                                                                                {normalizeStatus(record.status)}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300">{record.type || '-'}</td>
                                                                                        <td className="py-1 px-1 text-slate-600 dark:text-slate-300 font-mono">{record.number || '-'}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                                {isExpanded && (!account.accountRecords || account.accountRecords.length === 0) && (
                                                                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 italic">
                                                                        無帳戶紀錄
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Withdrawn */}
                                        {phaseData.withdrawn.length > 0 && (
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
                                                    已撤出 ({phaseData.withdrawn.length})
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {phaseData.withdrawn.map((account, idx) => (
                                                        <span key={idx} className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            {account.id}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty state */}
                                        {!isFundedPhase && phaseData.active.length === 0 && phaseData.passed.length === 0 && phaseData.failed.length === 0 && phaseData.suspended.length === 0 && phaseData.withdrawn.length === 0 && phaseData.created.length === 0 && (
                                            <div className="text-[10px] text-slate-300 dark:text-slate-600 italic">
                                                無狀態更新
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SankeyChart;
