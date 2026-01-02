import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Settings, Monitor, LayoutGrid, Tags, CheckCircle, ArrowRightLeft, Edit2, Trash2, GripVertical, ChevronRight, X, Pencil } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SettingsModal = ({ isOpen, onClose, firms, setFirms, accountSizes, setAccountSizes, accountStages, setAccountStages, accountTypes, setAccountTypes, accountStatuses, setAccountStatuses }) => {
    const [activeSection, setActiveSection] = useState('firms');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-7xl h-[700px] bg-[#0e0e11] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <Settings className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">基礎設置</h3>
                    </div>

                    <NavButton label="管理經紀商" icon={<Monitor size={18} />} active={activeSection === 'firms'} onClick={() => setActiveSection('firms')} />
                    <NavButton label="賬戶規模" icon={<LayoutGrid size={18} />} active={activeSection === 'sizes'} onClick={() => setActiveSection('sizes')} />
                    <NavButton label="賬戶階段" icon={<Tags size={18} />} active={activeSection === 'stages'} onClick={() => setActiveSection('stages')} />
                    <NavButton label="賬戶種類" icon={<Tags size={18} />} active={activeSection === 'types'} onClick={() => setActiveSection('types')} />
                    <NavButton label="賬戶狀態" icon={<CheckCircle size={18} />} active={activeSection === 'statuses'} onClick={() => setActiveSection('statuses')} />

                    <div className="mt-auto pt-6 border-t border-white/[0.06]">
                        <button onClick={onClose} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-medium">
                            <ArrowRightLeft className="w-4 h-4 rotate-180" /> 返回面板
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {activeSection === 'firms' && <FirmManagerContent firms={firms} setFirms={setFirms} />}
                    {activeSection === 'sizes' && <ListItemManager title="管理賬戶規模" items={accountSizes} setItems={setAccountSizes} placeholder="輸入新規模 (例如: 250K)..." />}
                    {activeSection === 'stages' && <ListItemManager title="管理賬戶階段" items={accountStages} setItems={setAccountStages} placeholder="輸入新階段 (例如: 1階挑戰)..." />}
                    {activeSection === 'types' && <AccountTypeManager accountTypes={accountTypes} setAccountTypes={setAccountTypes} />}
                    {activeSection === 'statuses' && <AccountStatusManager items={accountStatuses} setItems={setAccountStatuses} />}
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ label, icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium ${active ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}
    >
        {icon}
        {label}
    </button>
);

const FirmManagerContent = ({ firms, setFirms }) => {
    const [newFirm, setNewFirm] = useState('');
    const [activeTab, setActiveTab] = useState('期貨');
    const [editMode, setEditMode] = useState(null);
    const [editName, setEditName] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newFirm.trim()) {
            if (!firms.some(f => f.name === newFirm.trim())) {
                setFirms([...firms, { name: newFirm.trim(), type: activeTab }]);
                setNewFirm('');
            } else {
                toast.error('該經紀商已存在');
            }
        }
    };

    const handleDelete = (firmToDelete) => {
        if (confirm(`確定要刪除 ${firmToDelete} 嗎？`)) {
            setFirms(firms.filter(f => f.name !== firmToDelete));
        }
    };

    const startEdit = (firmName) => {
        setEditMode(firmName);
        setEditName(firmName);
    };

    const saveEdit = (oldName) => {
        if (editName.trim() && editName !== oldName) {
            setFirms(firms.map(f => f.name === oldName ? { ...f, name: editName.trim() } : f));
        }
        setEditMode(null);
    };

    const currentList = firms.filter(f => f.type === activeTab);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(currentList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Reconstruct full firms list: Keep other types as is, replace current type with reordered items
        const otherFirms = firms.filter(f => f.type !== activeTab);
        setFirms([...otherFirms, ...items]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">管理經紀商</h2>
                {/* Tabs */}
                <div className="flex bg-white/[0.03] p-1 rounded-lg border border-white/[0.05]">
                    {['期貨', 'CFD'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    placeholder={`輸入新 ${activeTab} 經紀商...`}
                    value={newFirm}
                    onChange={(e) => setNewFirm(e.target.value)}
                    className="flex-1 bg-[#18181b] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap">
                    新增
                </button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="firms-list">
                    {(provided) => (
                        <div
                            className="space-y-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {currentList.map((firm, index) => (
                                <Draggable key={`${firm.type}-${firm.name}-${index}`} draggableId={`${firm.type}-${firm.name}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <EditableItem
                                                text={firm.name}
                                                onDelete={() => handleDelete(firm.name)}
                                                isEditing={editMode === firm.name}
                                                editValue={editName}
                                                setEditValue={setEditName}
                                                onEditStart={() => startEdit(firm.name)}
                                                onEditSave={() => saveEdit(firm.name)}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {currentList.length === 0 && <p className="text-center text-slate-500 text-sm py-8 border border-dashed border-white/[0.1] rounded-xl">此類別暫無經紀商。</p>}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

// Account Type Manager with Grouped Phases
const AccountTypeManager = ({ accountTypes, setAccountTypes }) => {
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [expandedType, setExpandedType] = useState(null);
    const [configValues, setConfigValues] = useState({});

    // Normalize data: convert to grouped format with arrays
    const normalizedGroups = useMemo(() => {
        // Helper to ensure phase data is array with stable IDs
        const ensureArray = (data, groupId, phase) => {
            if (!data) return [];
            if (Array.isArray(data)) return data;
            // Convert single object to array - use existing id or generate stable one
            const id = data.id || `item-${groupId}-${phase}`;
            return [{ id, ...data }];
        };

        // If data is in old format, convert it
        if (accountTypes.length > 0 && typeof accountTypes[0] === 'string') {
            // Old string format - create groups with phase1 only
            return accountTypes.map((type, index) => ({
                id: `group-${index}`,
                phase1: [{ id: `item-${index}-phase1`, name: type, config: {} }],
                phase2: [],
                funded: []
            }));
        } else if (accountTypes.length > 0 && accountTypes[0].phase) {
            // Old phase-based format - convert to groups
            const groups = [];
            accountTypes.forEach((type, index) => {
                const groupId = `group-${index}`;
                const group = { id: groupId, phase1: [], phase2: [], funded: [] };
                const itemId = `item-${index}-${type.phase}`;
                const item = { id: itemId, name: type.name, config: type.config || {} };

                if (type.phase === 'phase1') {
                    group.phase1 = [item];
                } else if (type.phase === 'phase2') {
                    group.phase2 = [item];
                } else if (type.phase === 'funded') {
                    group.funded = [item];
                }

                groups.push(group);
            });
            return groups;
        } else if (accountTypes.length > 0 && accountTypes[0].id) {
            // Already in grouped format - ensure arrays
            return accountTypes.map(group => ({
                ...group,
                phase1: ensureArray(group.phase1, group.id, 'phase1'),
                phase2: ensureArray(group.phase2, group.id, 'phase2'),
                funded: ensureArray(group.funded, group.id, 'funded')
            }));
        }

        return [];
    }, [accountTypes]);

    const handleAddGroup = () => {
        const newGroup = {
            id: `group-${Date.now()}`,
            phase1: [],
            phase2: [],
            funded: []
        };
        setAccountTypes([...normalizedGroups, newGroup]);
    };

    const handleDeleteGroup = (groupId) => {
        if (confirm('確定要刪除這個組嗎？')) {
            setAccountTypes(normalizedGroups.filter(g => g.id !== groupId));
        }
    };

    const addPhaseItem = (groupId, phase) => {
        setAccountTypes(normalizedGroups.map(group => {
            if (group.id === groupId) {
                const newItem = { id: `item-${Date.now()}`, name: '', config: {} };
                return {
                    ...group,
                    [phase]: [...group[phase], newItem]
                };
            }
            return group;
        }));
        // Start editing the new item
        setEditMode(`${groupId}-${phase}-item-${Date.now()}`);
        setEditValue('');
    };

    const updatePhaseItem = (groupId, phase, itemId, newName) => {
        setAccountTypes(normalizedGroups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    [phase]: group[phase].map(item =>
                        item.id === itemId
                            ? { ...item, name: newName.trim() }
                            : item
                    ).filter(item => item.name.trim() !== '') // Remove empty items
                };
            }
            return group;
        }));
    };

    const deletePhaseItem = (groupId, phase, itemId) => {
        setAccountTypes(normalizedGroups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    [phase]: group[phase].filter(item => item.id !== itemId)
                };
            }
            return group;
        }));
    };

    const saveEdit = (groupId, phase, itemId, currentName) => {
        if (editValue.trim() !== currentName) {
            updatePhaseItem(groupId, phase, itemId, editValue);
        }
        setEditMode(null);
    };

    const toggleExpand = (key) => {
        if (expandedType === key) {
            setExpandedType(null);
        } else {
            // Parse key format: "groupId-phase-itemId"
            const parts = key.split('-');
            const itemId = parts.pop();
            const phase = parts.pop();
            const groupId = parts.join('-');

            const group = normalizedGroups.find(g => g.id === groupId);
            const item = group?.[phase]?.find(i => i.id === itemId);
            setExpandedType(key);
            setConfigValues(item?.config || {});
        }
    };

    const saveConfig = (groupId, phase, itemId) => {
        const updatedGroups = normalizedGroups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    [phase]: group[phase].map(item =>
                        item.id === itemId
                            ? { ...item, config: configValues }
                            : item
                    )
                };
            }
            return group;
        });

        setAccountTypes(updatedGroups);
        toast.success('配置已保存');
        setExpandedType(null);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(normalizedGroups);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setAccountTypes(items);
    };

    const renderPhaseCell = (group, phase, phaseLabel) => {
        const phaseItems = Array.isArray(group[phase]) ? group[phase] : (group[phase] ? [group[phase]] : []);

        return (
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{phaseLabel}</div>
                    <button
                        onClick={() => addPhaseItem(group.id, phase)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="新增種類"
                    >
                        + 新增
                    </button>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-2 min-h-[60px] space-y-2">
                    {phaseItems.length > 0 ? (
                        phaseItems.map((item) => {
                            const editKey = `${group.id}-${phase}-${item.id}`;
                            const expandKey = `${group.id}-${phase}-${item.id}`;
                            const isEditing = editMode === editKey;

                            return (
                                <div key={item.id}>
                                    <div className="flex items-center justify-between group/cell">
                                        {isEditing ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => saveEdit(group.id, phase, item.id, item.name)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEdit(group.id, phase, item.id, item.name);
                                                    else if (e.key === 'Escape') setEditMode(null);
                                                }}
                                                className="bg-transparent text-white text-sm font-medium focus:outline-none w-full border-b border-indigo-500 pb-1"
                                                placeholder="輸入種類名稱"
                                            />
                                        ) : (
                                            <span className="text-slate-200 text-sm font-medium">{item.name}</span>
                                        )}

                                        {!isEditing && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditMode(editKey); setEditValue(item.name); }} className="p-1 text-slate-500 hover:text-indigo-400 transition-colors" title="編輯名稱">
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => toggleExpand(expandKey)} className={`p-1 transition-colors ${Object.keys(item.config || {}).length > 0 ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-indigo-400'}`} title={Object.keys(item.config || {}).length > 0 ? '已配置' : '配置參數'}>
                                                    <Settings className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => deletePhaseItem(group.id, phase, item.id)} className="p-1 text-slate-500 hover:text-rose-500 transition-colors" title="刪除">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {expandedType === expandKey && (
                                        <div className="mt-2 p-3 border-t border-white/[0.06] bg-white/[0.02] rounded space-y-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xs font-semibold text-white">配置參數 - {item.name}</h4>
                                                <button onClick={() => setExpandedType(null)} className="p-1 text-slate-500 hover:text-white transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-slate-400 mb-1 block">標籤顏色</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { value: '', label: '預設', bg: 'bg-slate-500', ring: 'ring-slate-400' },
                                                            { value: 'red', label: '紅色', bg: 'bg-red-500', ring: 'ring-red-400' },
                                                            { value: 'orange', label: '橙色', bg: 'bg-orange-500', ring: 'ring-orange-400' },
                                                            { value: 'amber', label: '琥珀', bg: 'bg-amber-500', ring: 'ring-amber-400' },
                                                            { value: 'yellow', label: '黃色', bg: 'bg-yellow-500', ring: 'ring-yellow-400' },
                                                            { value: 'lime', label: '青檸', bg: 'bg-lime-500', ring: 'ring-lime-400' },
                                                            { value: 'emerald', label: '翠綠', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
                                                            { value: 'teal', label: '藍綠', bg: 'bg-teal-500', ring: 'ring-teal-400' },
                                                            { value: 'cyan', label: '青色', bg: 'bg-cyan-500', ring: 'ring-cyan-400' },
                                                            { value: 'blue', label: '藍色', bg: 'bg-blue-500', ring: 'ring-blue-400' },
                                                            { value: 'indigo', label: '靛藍', bg: 'bg-indigo-500', ring: 'ring-indigo-400' },
                                                            { value: 'violet', label: '紫羅蘭', bg: 'bg-violet-500', ring: 'ring-violet-400' },
                                                            { value: 'purple', label: '紫色', bg: 'bg-purple-500', ring: 'ring-purple-400' },
                                                            { value: 'pink', label: '粉紅', bg: 'bg-pink-500', ring: 'ring-pink-400' },
                                                        ].map(color => (
                                                            <button
                                                                key={color.value}
                                                                type="button"
                                                                onClick={() => setConfigValues({ ...configValues, color: color.value })}
                                                                className={`w-6 h-6 rounded-full ${color.bg} transition-all ${configValues.color === color.value ? `ring-2 ${color.ring} ring-offset-2 ring-offset-[#18181b] scale-110` : 'hover:scale-110'}`}
                                                                title={color.label}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-slate-400 mb-1 block">回撤類型</label>
                                                    <select value={configValues.drawdownType || ''} onChange={(e) => setConfigValues({ ...configValues, drawdownType: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                                                        <option value="">選擇類型...</option>
                                                        <option value="EOD Trailing">EOD Trailing</option>
                                                        <option value="Intraday Trailing">Intraday Trailing</option>
                                                        <option value="Static">Static</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">最大回撤</label>
                                                    <input type="text" placeholder="例如: $2,000 或 10%" value={configValues.maxDrawdown || ''} onChange={(e) => setConfigValues({ ...configValues, maxDrawdown: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">每日回撤</label>
                                                    <input type="text" placeholder="例如: $1,000 或 5%" value={configValues.dailyDrawdown || ''} onChange={(e) => setConfigValues({ ...configValues, dailyDrawdown: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">利潤目標</label>
                                                    <input type="text" placeholder="例如: $3,000 或 8%" value={configValues.profitTarget || ''} onChange={(e) => setConfigValues({ ...configValues, profitTarget: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">所需交易天數</label>
                                                    <input type="text" placeholder="例如: 5 天" value={configValues.tradingDaysRequired || ''} onChange={(e) => setConfigValues({ ...configValues, tradingDaysRequired: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">最低利潤金額</label>
                                                    <input type="text" placeholder="例如: $200" value={configValues.minimumProfitAmount || ''} onChange={(e) => setConfigValues({ ...configValues, minimumProfitAmount: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">一致性要求</label>
                                                    <input type="text" placeholder="例如: 30% 或無" value={configValues.consistency || ''} onChange={(e) => setConfigValues({ ...configValues, consistency: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400 mb-1 block">最大合約數</label>
                                                    <input type="text" placeholder="例如: 10" value={configValues.maxContracts || ''} onChange={(e) => setConfigValues({ ...configValues, maxContracts: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                </div>
                                                {phase === 'funded' && (
                                                    <>
                                                        <div>
                                                            <label className="text-[10px] text-slate-400 mb-1 block">最大出金</label>
                                                            <input type="text" placeholder="例如: $10,000 或 80%" value={configValues.maxPayout || ''} onChange={(e) => setConfigValues({ ...configValues, maxPayout: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-slate-400 mb-1 block">出金頻率</label>
                                                            <input type="text" placeholder="例如: 每週 或 Bi-weekly" value={configValues.payoutFrequency || ''} onChange={(e) => setConfigValues({ ...configValues, payoutFrequency: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-slate-400 mb-1 block">是否允許新聞交易</label>
                                                            <select value={configValues.newsTrading || ''} onChange={(e) => setConfigValues({ ...configValues, newsTrading: e.target.value })} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                                                                <option value="">選擇...</option>
                                                                <option value="允許">允許</option>
                                                                <option value="不允許">不允許</option>
                                                            </select>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-slate-400 mb-1 block">備註</label>
                                                    <textarea placeholder="其他說明或注意事項..." value={configValues.notes || ''} onChange={(e) => setConfigValues({ ...configValues, notes: e.target.value })} rows={2} className="w-full bg-[#18181b] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none" />
                                                </div>
                                            </div>

                                            <button onClick={() => saveConfig(group.id, phase, item.id)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-all">
                                                保存配置
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-slate-500 text-xs py-2">暫無種類</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">管理賬戶種類</h2>
                <button
                    onClick={handleAddGroup}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
                >
                    新增組
                </button>
            </div>

            {/* Header Row */}
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 pb-2 border-b border-white/[0.08]">
                <div className="w-8"></div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">階段 1</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">階段 2</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Funded</div>
                <div className="w-8"></div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="groups-list">
                    {(provided) => (
                        <div
                            className="space-y-3"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {normalizedGroups.map((group, index) => (
                                <Draggable key={group.id} draggableId={group.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.04] transition-colors group"
                                        >
                                            <div {...provided.dragHandleProps} className="flex items-start pt-6">
                                                <div className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing p-1">
                                                    <GripVertical size={16} />
                                                </div>
                                            </div>

                                            {renderPhaseCell(group, 'phase1', '階段 1')}
                                            {renderPhaseCell(group, 'phase2', '階段 2')}
                                            {renderPhaseCell(group, 'funded', 'Funded')}

                                            <div className="flex items-start pt-6">
                                                <button
                                                    onClick={() => handleDeleteGroup(group.id)}
                                                    className="p-1 text-slate-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                            {normalizedGroups.length === 0 && (
                                <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-white/[0.1] rounded-xl">
                                    暫無賬戶種類組。點擊「新增組」開始創建。
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

// Generic Manager for simple lists (Sizes, Types)
const ListItemManager = ({ title, items, setItems, placeholder }) => {
    const [newItem, setNewItem] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newItem.trim() && !items.includes(newItem.trim())) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleDelete = (item) => {
        if (confirm(`確定要刪除 ${item} 嗎？`)) {
            setItems(items.filter(i => i !== item));
        }
    };

    const startEdit = (item) => {
        setEditMode(item);
        setEditValue(item);
    };

    const saveEdit = (oldValue) => {
        if (editValue.trim() && editValue !== oldValue) {
            setItems(items.map(i => i === oldValue ? editValue.trim() : i));
        }
        setEditMode(null);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        setItems(newItems);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">{title}</h2>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1 bg-[#18181b] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap">
                    新增
                </button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="simple-list">
                    {(provided) => (
                        <div
                            className="space-y-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {items.map((item, index) => (
                                <Draggable key={`${item}-${index}`} draggableId={`${item}-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <EditableItem
                                                text={item}
                                                onDelete={() => handleDelete(item)}
                                                isEditing={editMode === item}
                                                editValue={editValue}
                                                setEditValue={setEditValue}
                                                onEditStart={() => startEdit(item)}
                                                onEditSave={() => saveEdit(item)}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

// Account Status Manager with Color Selection
const AccountStatusManager = ({ items, setItems }) => {
    const [newItem, setNewItem] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [colorPickerOpen, setColorPickerOpen] = useState(null);

    const colors = [
        { value: 'slate', label: '灰色', bg: 'bg-slate-500' },
        { value: 'red', label: '紅色', bg: 'bg-red-500' },
        { value: 'orange', label: '橙色', bg: 'bg-orange-500' },
        { value: 'amber', label: '琥珀', bg: 'bg-amber-500' },
        { value: 'yellow', label: '黃色', bg: 'bg-yellow-500' },
        { value: 'lime', label: '青檸', bg: 'bg-lime-500' },
        { value: 'emerald', label: '翠綠', bg: 'bg-emerald-500' },
        { value: 'teal', label: '藍綠', bg: 'bg-teal-500' },
        { value: 'cyan', label: '青色', bg: 'bg-cyan-500' },
        { value: 'blue', label: '藍色', bg: 'bg-blue-500' },
        { value: 'indigo', label: '靛藍', bg: 'bg-indigo-500' },
        { value: 'violet', label: '紫羅蘭', bg: 'bg-violet-500' },
        { value: 'purple', label: '紫色', bg: 'bg-purple-500' },
        { value: 'pink', label: '粉紅', bg: 'bg-pink-500' },
    ];

    // Normalize items to object format
    const normalizedItems = items.map(item => {
        if (typeof item === 'string') {
            return { name: item, color: 'slate' };
        }
        return item;
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (newItem.trim() && !normalizedItems.find(i => i.name === newItem.trim())) {
            setItems([...normalizedItems, { name: newItem.trim(), color: 'slate' }]);
            setNewItem('');
        }
    };

    const handleDelete = (itemName) => {
        if (confirm(`確定要刪除 ${itemName} 嗎？`)) {
            setItems(normalizedItems.filter(i => i.name !== itemName));
        }
    };

    const startEdit = (itemName) => {
        setEditMode(itemName);
        setEditValue(itemName);
    };

    const saveEdit = (oldName) => {
        if (editValue.trim() && editValue !== oldName) {
            setItems(normalizedItems.map(i => i.name === oldName ? { ...i, name: editValue.trim() } : i));
        }
        setEditMode(null);
    };

    const updateColor = (itemName, color) => {
        setItems(normalizedItems.map(i => i.name === itemName ? { ...i, color } : i));
        setColorPickerOpen(null);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newItems = Array.from(normalizedItems);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems);
    };

    const getColorBg = (colorValue) => {
        const color = colors.find(c => c.value === colorValue);
        return color ? color.bg : 'bg-slate-500';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white">管理賬戶狀態</h2>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    placeholder="輸入新狀態 (例如: Active)..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1 bg-[#18181b] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap">
                    新增
                </button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="status-list">
                    {(provided) => (
                        <div className="space-y-2" {...provided.droppableProps} ref={provided.innerRef}>
                            {normalizedItems.map((item, index) => (
                                <Draggable key={item.name} draggableId={item.name} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] group hover:bg-white/[0.05] transition-colors">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div {...provided.dragHandleProps} className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing p-1">
                                                        <GripVertical size={16} />
                                                    </div>

                                                    {/* Color indicator */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setColorPickerOpen(colorPickerOpen === item.name ? null : item.name)}
                                                            className={`w-6 h-6 rounded-full ${getColorBg(item.color)} hover:scale-110 transition-transform border-2 border-white/20`}
                                                            title="選擇顏色"
                                                        />
                                                        {colorPickerOpen === item.name && (
                                                            <div className="absolute top-8 left-0 z-50 p-2 bg-[#1a1a1d] border border-white/10 rounded-lg shadow-xl">
                                                                <div className="flex flex-wrap gap-1.5 w-[180px]">
                                                                    {colors.map(color => (
                                                                        <button
                                                                            key={color.value}
                                                                            onClick={() => updateColor(item.name, color.value)}
                                                                            className={`w-5 h-5 rounded-full ${color.bg} hover:scale-110 transition-transform ${item.color === color.value ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1a1a1d]' : ''}`}
                                                                            title={color.label}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {editMode === item.name ? (
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={() => saveEdit(item.name)}
                                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.name)}
                                                            className="flex-1 bg-transparent border-b border-indigo-500 text-white focus:outline-none px-1"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-medium">{item.name}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => startEdit(item.name)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.name)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

const EditableItem = ({ text, onDelete, isEditing, editValue, setEditValue, onEditStart, onEditSave, dragHandleProps }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] group hover:bg-white/[0.05] transition-colors">
        <div className="flex items-center gap-3 flex-1">
            <div {...dragHandleProps} className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing p-1">
                <GripVertical size={16} />
            </div>

            {isEditing ? (
                <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={onEditSave}
                    onKeyDown={(e) => e.key === 'Enter' && onEditSave()}
                    className="bg-transparent text-white text-sm font-medium focus:outline-none w-full border-b border-indigo-500 pb-1"
                />
            ) : (
                <span className="text-slate-200 text-sm font-medium">{text}</span>
            )}
        </div>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEditStart} className="p-2 text-slate-500 hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-500/10">
                <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-2 text-slate-500 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default SettingsModal;
