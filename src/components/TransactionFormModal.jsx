import React from 'react';
import { Edit2, Plus, X, ChevronDown, Trash2 } from 'lucide-react';
import { InputGroup, SelectGroup } from './FormElements';
import { normalizeStatus } from '../utils/helpers';

// 輔助函數：從狀態值提取名稱（處理 {name, color} 物件格式），預設為 'Active'
const getStatusName = (status) => normalizeStatus(status, 'Active');

const TransactionFormModal = ({
    isOpen,
    onClose,
    isEditing,
    formData,
    setFormData,
    handleSubmit,
    accountStages = [],
    accountTypes = [],
    accountSizes = [],
    accountStatuses = ['Active', 'Suspended', 'Failed', 'Passed', 'Withdrawn'],
    availableFirms = []
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-3xl bg-white dark:bg-[#0e0e11] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden scale-in-center animate-in fade-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {isEditing ? <Edit2 className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-indigo-500" />}
                        {isEditing ? '編輯交易' : '新增交易'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <InputGroup label="日期" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />

                        <SelectGroup
                            label="類別"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value, firm: '' })}
                            options={['期貨', 'CFD']}
                        />

                        {/* Firm Select - Filtered by Category */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">經紀商 ({formData.category})</label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.firm}
                                    onChange={e => setFormData({ ...formData, firm: e.target.value })}
                                    className="w-full bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>選擇經紀商</option>
                                    {availableFirms.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        <SelectGroup label="賬戶階段" value={formData.accountStage} onChange={e => setFormData({ ...formData, accountStage: e.target.value })} options={accountStages} />
                        <SelectGroup label="帳戶種類" value={formData.phase} onChange={e => setFormData({ ...formData, phase: e.target.value })} options={accountTypes} />
                        <SelectGroup label="帳戶規模" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} options={accountSizes} />
                        <InputGroup label="基礎成本 ($)" type="number" value={formData.baseCost} onChange={e => setFormData({ ...formData, baseCost: e.target.value })} />
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">纍積成本 (預覽)</label>
                            <div className="w-full bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                                ${(Number(formData.baseCost || 0) + (formData.accountRecords || []).reduce((sum, r) => sum + Number(r.extraCost || 0), 0)).toLocaleString()}
                            </div>
                        </div>

                        {/* Account Status Field */}
                        <div className="col-span-2">
                            <SelectGroup
                                label="賬戶狀態"
                                value={getStatusName(formData.accountStatus) || getStatusName(accountStatuses[0])}
                                onChange={e => setFormData({ ...formData, accountStatus: e.target.value })}
                                options={accountStatuses}
                            />
                        </div>

                        {/* Account Records Manager Section */}
                        <div className="col-span-2 space-y-3 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/[0.05]">
                                <div className="flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 flex-1">帳戶紀錄 (額外成本總計: ${(formData.accountRecords || []).reduce((sum, r) => sum + Number(r.extraCost || 0), 0).toLocaleString()})</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newRecord = {
                                                id: Date.now(),
                                                date: new Date().toISOString().split('T')[0],
                                                status: getStatusName(accountStatuses?.[0]),
                                                type: formData.phase,
                                                number: '',
                                                extraCost: 0
                                            };
                                            setFormData({ ...formData, accountRecords: [...(formData.accountRecords || []), newRecord] });
                                        }}
                                        className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        <Plus className="w-3 h-3" /> 新增帳戶
                                    </button>
                                </div>

                                {/* Column Headers */}
                                {(formData.accountRecords || []).length > 0 && (
                                    <div className="grid grid-cols-12 gap-3 px-1 pb-1 border-b border-slate-200 dark:border-white/[0.08]">
                                        <div className="col-span-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">日期</div>
                                        <div className="col-span-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">賬戶狀態</div>
                                        <div className="col-span-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">帳戶種類</div>
                                        <div className="col-span-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">帳戶號碼</div>
                                        <div className="col-span-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">額外成本</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {(formData.accountRecords || []).map((record, index) => (
                                        <div key={record.id} className="grid grid-cols-12 gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="col-span-2">
                                                <input
                                                    type="date"
                                                    value={record.date}
                                                    onChange={e => {
                                                        const newRecords = [...formData.accountRecords];
                                                        newRecords[index].date = e.target.value;
                                                        setFormData({ ...formData, accountRecords: newRecords });
                                                    }}
                                                    className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="日期"
                                                />
                                            </div>
                                            <div className="col-span-2 relative">
                                                <select
                                                    value={getStatusName(record.status) || getStatusName(accountStatuses[0])}
                                                    onChange={e => {
                                                        const newRecords = [...formData.accountRecords];
                                                        newRecords[index].status = e.target.value;
                                                        setFormData({ ...formData, accountRecords: newRecords });
                                                    }}
                                                    className="w-full bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 dark:border-emerald-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer font-bold"
                                                >
                                                    {accountStatuses.map((status, idx) => {
                                                        const statusName = typeof status === 'string' ? status : status.name;
                                                        return <option key={statusName || idx} value={statusName}>{statusName}</option>;
                                                    })}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                                            </div>
                                            <div className="col-span-2 relative">
                                                <select
                                                    value={record.type || formData.phase}
                                                    onChange={e => {
                                                        const newRecords = [...formData.accountRecords];
                                                        newRecords[index].type = e.target.value;
                                                        setFormData({ ...formData, accountRecords: newRecords });
                                                    }}
                                                    className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                                                >
                                                    {accountTypes.map((type, idx) => {
                                                        const typeName = typeof type === 'string' ? type : type.name;
                                                        return <option key={typeName || idx} value={typeName}>{typeName}</option>;
                                                    })}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 dark:text-slate-400 pointer-events-none" />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    value={record.number}
                                                    onChange={e => {
                                                        const newRecords = [...formData.accountRecords];
                                                        newRecords[index].number = e.target.value;
                                                        setFormData({ ...formData, accountRecords: newRecords });
                                                    }}
                                                    className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                                                    placeholder="帳戶號碼"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    value={record.extraCost}
                                                    onChange={e => {
                                                        const newRecords = [...formData.accountRecords];
                                                        newRecords[index].extraCost = e.target.value;
                                                        setFormData({ ...formData, accountRecords: newRecords });
                                                    }}
                                                    className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                                                    placeholder="額外成本"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, accountRecords: formData.accountRecords.filter(r => r.id !== record.id) });
                                                    }}
                                                    className="text-slate-400 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(formData.accountRecords || []).length === 0 && (
                                        <div className="text-center py-4 text-xs text-slate-400 italic">
                                            尚無帳戶紀錄
                                        </div>
                                    )}
                                </div>
                            </div>

                        {/* Payout Manager Section */}
                        <div className="col-span-2 space-y-3 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/[0.05]">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 flex-1">出金紀錄 (纍積收益: ${(formData.payouts || []).reduce((sum, p) => p.arrived === '是' ? sum + (Number(p.amount) || 0) : sum, 0).toLocaleString()})</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newPayout = { id: Date.now(), date: new Date().toISOString().split('T')[0], amount: '', arrivalDate: '', arrived: '', notes: '' };
                                        setFormData({ ...formData, payouts: [...(formData.payouts || []), newPayout] });
                                    }}
                                    className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                                >
                                    <Plus className="w-3 h-3" /> 新增出金
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(formData.payouts || []).map((payout, index) => (
                                    <div key={payout.id} className="grid grid-cols-12 gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="col-span-2">
                                            <input
                                                type="date"
                                                value={payout.date}
                                                onChange={e => {
                                                    const newPayouts = [...formData.payouts];
                                                    newPayouts[index].date = e.target.value;
                                                    setFormData({ ...formData, payouts: newPayouts });
                                                }}
                                                className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                placeholder="出金日期"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                value={payout.amount}
                                                onChange={e => {
                                                    const newPayouts = [...formData.payouts];
                                                    newPayouts[index].amount = e.target.value;
                                                    setFormData({ ...formData, payouts: newPayouts });
                                                }}
                                                className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                                                placeholder="金額"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                value={payout.arrivalDate}
                                                onChange={e => {
                                                    const newPayouts = [...formData.payouts];
                                                    newPayouts[index].arrivalDate = e.target.value;
                                                    setFormData({ ...formData, payouts: newPayouts });
                                                }}
                                                className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                placeholder="到賬時間"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <select
                                                value={payout.arrived || ''}
                                                onChange={e => {
                                                    const newPayouts = [...formData.payouts];
                                                    newPayouts[index].arrived = e.target.value;
                                                    setFormData({ ...formData, payouts: newPayouts });
                                                }}
                                                className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="">出金到賬</option>
                                                <option value="是">是</option>
                                                <option value="否">否</option>
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                value={payout.notes}
                                                onChange={e => {
                                                    const newPayouts = [...formData.payouts];
                                                    newPayouts[index].notes = e.target.value;
                                                    setFormData({ ...formData, payouts: newPayouts });
                                                }}
                                                className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                placeholder="備註"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, payouts: formData.payouts.filter(p => p.id !== payout.id) });
                                                }}
                                                className="text-slate-400 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(formData.payouts || []).length === 0 && (
                                    <div className="text-center py-4 text-xs text-slate-400 italic">
                                        尚無出金紀錄
                                    </div>
                                )}
                            </div>
                        </div>



                    </div>

                    <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25">
                        {isEditing ? '保存修改' : '提交新增'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal;
