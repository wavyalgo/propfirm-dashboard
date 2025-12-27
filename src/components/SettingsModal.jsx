import React, { useState } from 'react';
import { toast } from 'sonner';
import { Settings, Monitor, LayoutGrid, Tags, ArrowRightLeft, Edit2, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SettingsModal = ({ isOpen, onClose, firms, setFirms, accountSizes, setAccountSizes, accountTypes, setAccountTypes }) => {
    const [activeSection, setActiveSection] = useState('firms');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl h-[600px] bg-[#0e0e11] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <Settings className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">基礎設置</h3>
                    </div>

                    <NavButton label="管理經紀商" icon={<Monitor size={18} />} active={activeSection === 'firms'} onClick={() => setActiveSection('firms')} />
                    <NavButton label="賬戶規模" icon={<LayoutGrid size={18} />} active={activeSection === 'sizes'} onClick={() => setActiveSection('sizes')} />
                    <NavButton label="賬戶種類" icon={<Tags size={18} />} active={activeSection === 'types'} onClick={() => setActiveSection('types')} />

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
                    {activeSection === 'types' && <ListItemManager title="管理賬戶種類" items={accountTypes} setItems={setAccountTypes} placeholder="輸入新種類 (例如: Funded)..." />}
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
                                <Draggable key={firm.name} draggableId={firm.name} index={index}>
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
                                <Draggable key={item} draggableId={item} index={index}>
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
