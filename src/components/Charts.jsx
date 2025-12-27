import React from 'react';

export const ChartRow = ({ label, value, total, color, showPercent = true }) => {
    const percent = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-500">
                    ${value.toLocaleString()} {showPercent && `(${percent.toFixed(0)}%)`}
                </span>
            </div>
            <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                <div className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`} style={{ width: `${Math.min(100, percent)}%`, opacity: 0.8 }}></div>
            </div>
        </div>
    );
};

export const DonutChart = ({ data, total, label }) => {
    const size = 180;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let currentAngle = -90; // Start from top

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform rotate-0">
                    {/* Background Circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-slate-100 dark:text-white/[0.05]"
                    />

                    {/* Segments */}
                    {data.map((item, index) => {
                        if (item.value <= 0) return null;
                        const percentage = total > 0 ? item.value / total : 0;
                        const strokeDasharray = `${percentage * circumference} ${circumference}`;
                        const rotation = currentAngle;
                        currentAngle += percentage * 360;

                        return (
                            <circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeLinecap="round" // Optional: makes ends round, might look weird if perfectly touching
                                transform={`rotate(${rotation} ${center} ${center})`}
                                className="transition-all duration-1000 ease-out"
                            />
                        );
                    })}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">${total.toLocaleString()}</span>
                </div>
            </div>

            {/* Legend - Updated for compact spacing */}
            <div className="w-full flex flex-col gap-2">
                {data.map((item, index) => {
                    const percent = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                        <div key={index} className="flex items-center gap-3 text-xs w-fit mx-auto">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
                            </div>
                            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            <span className="text-slate-500 font-mono">
                                ${item.value.toLocaleString()} <span className="text-[10px] opacity-70">({percent.toFixed(1)}%)</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
