import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

// --- 預設商品資料 ---
// CFD 預設 (固定清單)
const cfdPresets = {
  'EURUSD': { name: 'EURUSD', contractSize: 100000, defaultPrice: 1.0550 },
  'GBPUSD': { name: 'GBPUSD', contractSize: 100000, defaultPrice: 1.2700 },
  'USDJPY': { name: 'USDJPY', contractSize: 100000, defaultPrice: 150.00 },
  'XAUUSD': { name: 'XAUUSD', contractSize: 100, defaultPrice: 2650 },
  'US500': { name: 'US500', contractSize: 1, defaultPrice: 5800 },
  'US100': { name: 'US100', contractSize: 1, defaultPrice: 20500 },
};

// 期貨預設 (固定清單)
const futuresPresets = {
  'ES': { name: 'ES (E-mini S&P)', contractSize: 50, defaultPrice: 5800, margin: 12500 },
  'MES': { name: 'MES (Micro S&P)', contractSize: 5, defaultPrice: 5800, margin: 1250 },
  'NQ': { name: 'NQ (E-mini Nas)', contractSize: 20, defaultPrice: 20500, margin: 18500 },
  'MNQ': { name: 'MNQ (Micro Nas)', contractSize: 2, defaultPrice: 20500, margin: 1850 },
  'GC': { name: 'GC (Gold)', contractSize: 100, defaultPrice: 2650, margin: 11000 },
  'MGC': { name: 'MGC (Micro Gold)', contractSize: 10, defaultPrice: 2650, margin: 1100 }
};

export default function PositionCalculator({ theme }) {
  const isDark = theme === 'dark';

  // 模式狀態：'CFD' 或 'Futures'
  const [calcMode, setCalcMode] = useState('CFD');

  const activePresets = calcMode === 'CFD' ? cfdPresets : futuresPresets;
  const defaultPresetKey = Object.keys(activePresets)[0];

  const [balance, setBalance] = useState(10000);
  const [leverage, setLeverage] = useState(500); // CFD 用
  const [fixedMargin, setFixedMargin] = useState(activePresets[defaultPresetKey].margin || 0); // 期貨用 (單口保證金)

  const [riskPercent, setRiskPercent] = useState(1);

  const [selectedPreset, setSelectedPreset] = useState(defaultPresetKey);
  const [contractSize, setContractSize] = useState(activePresets[defaultPresetKey].contractSize);
  const [entryPrice, setEntryPrice] = useState(activePresets[defaultPresetKey].defaultPrice);

  // 盈虧比相關狀態
  const [stopLoss, setStopLoss] = useState(50); // Points
  const [takeProfit, setTakeProfit] = useState(100); // Points
  const [rewardRatio, setRewardRatio] = useState(2); // 1:2

  // 當模式切換時，重置選單
  useEffect(() => {
    const presets = calcMode === 'CFD' ? cfdPresets : futuresPresets;
    const firstKey = Object.keys(presets)[0];
    setSelectedPreset(firstKey);
    setContractSize(presets[firstKey].contractSize);
    setEntryPrice(presets[firstKey].defaultPrice);
    if (calcMode === 'Futures') {
      setFixedMargin(presets[firstKey].margin || 0);
    }
  }, [calcMode]);

  const handlePresetChange = (key) => {
    setSelectedPreset(key);
    setContractSize(activePresets[key].contractSize);
    setEntryPrice(activePresets[key].defaultPrice);

    if (calcMode === 'Futures' && activePresets[key].margin) {
      setFixedMargin(activePresets[key].margin);
    }
  };

  const toggleMode = () => {
    setCalcMode(prev => prev === 'CFD' ? 'Futures' : 'CFD');
  };

  const handleSLChange = (val) => {
    const newSL = Number(val);
    setStopLoss(newSL);
    if (rewardRatio > 0) {
      setTakeProfit(parseFloat((newSL * rewardRatio).toFixed(2)));
    }
  };

  const handleRatioChange = (val) => {
    const newRatio = Number(val);
    setRewardRatio(newRatio);
    if (stopLoss > 0) {
      setTakeProfit(parseFloat((stopLoss * newRatio).toFixed(2)));
    }
  };

  const handleTPChange = (val) => {
    const newTP = Number(val);
    setTakeProfit(newTP);
    if (stopLoss > 0 && newTP > 0) {
      setRewardRatio(parseFloat((newTP / stopLoss).toFixed(2)));
    }
  };

  const results = useMemo(() => {
    const riskAmount = balance * (riskPercent / 100);

    let pointValue = 0; // 每點的美元價值
    let lots = 0;
    let requiredMargin = 0;

    if (calcMode === 'CFD') {
      // CFD 模式：使用 points (點數) 作為單位
      if (selectedPreset === 'USDJPY') {
        // USD/JPY: 1 point = 0.01 (1 pip for JPY pairs)
        // Point 值 = (0.01 / 匯率) × 合約規格
        const pointSize = 0.01;
        pointValue = (pointSize / entryPrice) * contractSize;
      } else if (selectedPreset === 'EURUSD' || selectedPreset === 'GBPUSD') {
        // XXX/USD 外匯對: 1 point = 0.0001 (等同於 1 pip)
        // Point 值 = 0.0001 × 合約規格
        const pointSize = 0.0001;
        pointValue = pointSize * contractSize;
      } else if (selectedPreset === 'XAUUSD') {
        // 黃金: 1 point = $0.01 價格變動 (1 cent)
        // 1 lot (100 oz) × $0.01 = $1 per point
        const pointSize = 0.01;
        pointValue = contractSize * pointSize;
      } else if (selectedPreset === 'US500') {
        // S&P 500 CFD: 1 point = 1 index point
        // contractSize = 1 通常表示 $1 per point
        pointValue = contractSize * 1;
      } else if (selectedPreset === 'US100') {
        // Nasdaq 100 CFD: 1 point = 1 index point
        pointValue = contractSize * 1;
      } else if (selectedPreset === 'Custom') {
        // 自定義: 預設使用 0.01 作為點大小
        // 點值 = 合約規格 × 0.01
        const pointSize = 0.01;
        pointValue = contractSize * pointSize;
      } else {
        // 其他: 使用外匯標準 (0.0001)
        const pointSize = 0.0001;
        pointValue = pointSize * contractSize;
      }

      // 計算手數
      lots = stopLoss > 0 && pointValue > 0 ? riskAmount / (stopLoss * pointValue) : 0;

      // CFD 保證金 = (手數 × 合約規格 × 入場價) / 槓桿
      requiredMargin = leverage > 0 ? (lots * contractSize * entryPrice) / leverage : 0;

    } else {
      // 期貨模式：contractSize 就是每點價值 (Point Value)
      pointValue = contractSize;

      // 計算合約數量
      lots = stopLoss > 0 && pointValue > 0 ? riskAmount / (stopLoss * pointValue) : 0;

      // 期貨保證金 = 合約數量 × 單口保證金
      requiredMargin = lots * fixedMargin;
    }

    // 計算盈利金額
    const profitAmount = lots * takeProfit * pointValue;

    // 實際風險金額（應該等於 riskAmount）
    const actualRisk = lots * stopLoss * pointValue;

    // 保證金使用率
    const marginUsage = balance > 0 ? (requiredMargin / balance) * 100 : 0;

    return {
      riskAmount: riskAmount,
      lots: lots,
      profitAmount: profitAmount,
      actualRisk: actualRisk,
      requiredMargin: requiredMargin,
      marginUsage: marginUsage,
      pointValue: pointValue
    };
  }, [balance, riskPercent, stopLoss, contractSize, takeProfit, entryPrice, leverage, fixedMargin, calcMode, selectedPreset]);

  const inputClass = `w-full px-4 py-2.5 rounded-lg border outline-none transition-all font-mono text-sm
    ${isDark
      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-slate-600'
      : 'bg-white border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-slate-900 placeholder-gray-400'
    }`;

  const labelClass = `block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

  // Helper for Margin Color
  const getMarginColor = (usage) => {
    if (usage > 80) return 'text-red-500';
    if (usage > 50) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  return (
    <div className="p-4 h-full flex flex-col justify-start overflow-y-auto">
      <div className="flex flex-col gap-6">

        {/* 輸入區 */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              交易商品 ({calcMode === 'CFD' ? '差價合約' : '期貨'})
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {Object.entries(activePresets).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  className={`px-2 py-2 text-xs rounded-lg transition-all text-left truncate flex items-center justify-between font-medium
                    ${selectedPreset === key
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20 border border-emerald-400/20'
                      : (isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600' : 'bg-gray-100 text-slate-600 hover:bg-gray-200 border border-gray-200')
                    }`}
                >
                  <span>{data.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>餘額 (USD)</label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              {calcMode === 'CFD' ? (
                <>
                  <label className={labelClass}>槓桿 (1 : X)</label>
                  <input
                    type="number"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className={inputClass}
                    placeholder="500"
                  />
                </>
              ) : (
                <>
                  <label className={labelClass}>單口保證金 ($)</label>
                  <input
                    type="number"
                    value={fixedMargin}
                    onChange={(e) => setFixedMargin(Number(e.target.value))}
                    className={inputClass}
                    placeholder="初始保證金"
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className={labelClass}>
                現價 (Price)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>風險 (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border border-dashed
            ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
            {/* 提示說明 */}
            <div className={`text-[10px] mb-3 px-2 py-1.5 rounded ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-white text-slate-500'}`}>
              {calcMode === 'CFD' ? (
                selectedPreset.includes('USD') && !selectedPreset.includes('JPY')
                  ? 'EUR/GBP/USD: 1 點 = 0.0001'
                  : selectedPreset === 'USDJPY'
                    ? 'USD/JPY: 1 點 = 0.01'
                    : selectedPreset === 'XAUUSD'
                      ? '黃金: 1 點 = $0.01 (1 cent)'
                      : '指數: 1 點 = 1 指數點'
              ) : '期貨: 1 點 = 最小跳動值'}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={labelClass}>止損 (SL Points)</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => handleSLChange(e.target.value)}
                  className={`${inputClass} !text-red-500 font-bold`}
                />
              </div>
              <div>
                <label className={labelClass}>止盈 (TP Points)</label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => handleTPChange(e.target.value)}
                  className={`${inputClass} !text-green-500 font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>盈虧比 (R:R)</label>
              <div className="relative flex items-center">
                <span className={`mr-2 font-mono text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1:</span>
                <input
                  type="number"
                  value={rewardRatio}
                  step="0.1"
                  onChange={(e) => handleRatioChange(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {calcMode === 'Futures' ? '每點價值 (Point Value $)' : '合約規格 (Contract Size)'}
            </label>
            <input
              type="number"
              value={contractSize}
              onChange={(e) => {
                setContractSize(Number(e.target.value));
                setSelectedPreset('Custom');
              }}
              className={`${inputClass} ${selectedPreset !== 'Custom' ? 'opacity-70' : ''}`}
              placeholder={calcMode === 'Futures' ? '例如: ES=$50, NQ=$20' : '例如: EURUSD=100000'}
            />
          </div>
        </div>

        {/* 結果區 */}
        <div className={`rounded-xl p-5 flex flex-col justify-between border relative overflow-hidden shrink-0 shadow-lg
          ${isDark
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100'
          }`}>

          <div className="text-center mb-4">
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              建議開倉數量 (Volume)
            </h3>
            <div className={`text-4xl lg:text-5xl font-black font-mono mb-1
              ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {results.lots < 1000 ? results.lots.toFixed(2) : '>1k'}
            </div>
          </div>

          {/* Margin Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 border-b border-dashed border-slate-300 dark:border-slate-700 pb-4">
            <div>
              <div className={`text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                所需保證金
              </div>
              <div className={`text-base font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                ${results.requiredMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                保證金佔用
              </div>
              <div className={`text-base font-mono font-bold ${getMarginColor(results.marginUsage)}`}>
                {results.marginUsage.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Visual Bar & Profit/Risk */}
          <div className="w-full">
            <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 mb-3 shadow-inner">
              <div style={{ flex: 1 }} className="bg-gradient-to-r from-red-500 to-red-600"></div>
              <div style={{ flex: Math.max(0.1, rewardRatio) }} className="bg-gradient-to-r from-green-500 to-green-600"></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-mono font-bold">
              <span className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                -${results.riskAmount.toLocaleString()}
              </span>
              <span className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                +${results.profitAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 模式切換按鈕 */}
        <div className={`p-4 border-t flex justify-center
          ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <button
            onClick={toggleMode}
            className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md
              ${isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600 hover:border-slate-500'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 hover:border-emerald-500/30'
              }`}
          >
            <RefreshCw size={14} className="opacity-70" />
            切換至 {calcMode === 'CFD' ? '期貨 (Futures)' : '差價合約 (CFD)'} 模式
          </button>
        </div>

      </div>
    </div>
  );
}
