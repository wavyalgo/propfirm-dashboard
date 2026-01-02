/**
 * 共用輔助函數
 */

/**
 * 確保狀態值是字串（處理 {name, color} 物件格式）
 * @param {string|object|null|undefined} status - 狀態值
 * @param {string} defaultValue - 預設值
 * @returns {string} 正規化後的狀態字串
 */
export const normalizeStatus = (status, defaultValue = '') => {
    if (!status) return defaultValue;
    if (typeof status === 'string') return status;
    if (typeof status === 'object' && status.name) return status.name;
    return defaultValue;
};

/**
 * 安全的數字格式化
 * @param {any} num - 要格式化的數字
 * @returns {string} 格式化後的字串
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    try {
        return Number(num).toLocaleString();
    } catch {
        return String(num);
    }
};

/**
 * 安全的數字轉換
 * @param {any} value - 要轉換的值
 * @param {number} defaultValue - 預設值
 * @returns {number} 轉換後的數字
 */
export const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
};

/**
 * 狀態顏色映射
 */
export const STATUS_COLORS = {
    Active: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        hover: 'hover:bg-emerald-500/20'
    },
    Passed: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/30',
        hover: 'hover:bg-blue-500/20'
    },
    Suspended: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        hover: 'hover:bg-amber-500/20'
    },
    Failed: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        hover: 'hover:bg-rose-500/20'
    },
    Withdrawn: {
        bg: 'bg-slate-500/10',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        hover: 'hover:bg-slate-500/20'
    }
};

/**
 * 獲取狀態樣式類名
 * @param {string} status - 狀態值
 * @returns {string} Tailwind 類名
 */
export const getStatusClasses = (status) => {
    const colors = STATUS_COLORS[status];
    if (!colors) {
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
    }
    return `${colors.bg} ${colors.text} ${colors.border} ${colors.hover}`;
};
