import React from 'react';
import { ChevronDown } from 'lucide-react';

export const InputGroup = ({ label, type = "text", placeholder, value, onChange, required = true }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">{label}</label>
        <input
            type={type}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
    </div>
);

export const SelectGroup = ({ label, value, onChange, options }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
                {options.map((o, idx) => {
                    const optValue = typeof o === 'string' ? o : o.name;
                    return <option key={optValue || idx} value={optValue}>{optValue}</option>;
                })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
    </div>
);
