import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// 策略数据
const strategies = [
  {
    id: 1,
    title: "ICT Silver Bullet (銀彈)",
    type: "Scalping (剝頭皮)",
    timeframe: "M1 / M5",
    winRate: "68%",
    riskReward: "1:2 ~ 1:3",
    bestSession: "London (3-4 AM) / NY (10-11 AM)",
    indicators: "FVG, Liquidity Pools",
    shortDesc: "利用特定一小時窗口內的流動性獵取與價格失衡回補，捕捉高勝率短線行情。",
    longDescription: "ICT Silver Bullet 是一種高度機械化的時間驅動策略。它不依賴滯後的指標，而是專注於算法在特定時間窗口（Silver Bullet Hour）內的價格交付行為。核心邏輯在於：當市場在該窗口內獵取了流動性（Liquidity Sweep）並發生市場結構轉變（MSS）後，價格極大概率會回撤至公允價值缺口（FVG），並繼續向反方向的流動性池移動。",
    rules: [
      "確認當前時間是否為 Silver Bullet 窗口 (如紐約 10:00-11:00 AM)。",
      "觀察價格是否剛剛掃蕩了顯著的高點或低點 (Buy/Sell-side Liquidity)。",
      "等待價格強勢反轉，並形成市場結構破壞 (MSS)。",
      "識別反轉過程中留下的公允價值缺口 (FVG)。",
      "在價格回撤至 FVG 區域時掛單入場。",
      "止損設在波動高/低點外 3-5 點，目標為下一個流動性池。"
    ],
    steps: [
      { title: "步驟 1: 流動性獵取 (Sweep)", desc: "價格突破舊高/舊低 (BSL/SSL)，誘使突破交易者進場並觸發止損。" },
      { title: "步驟 2: 結構破壞 (MSS)", desc: "價格快速反轉，實體K線收盤價跌破/突破近期波動點，確認趨勢反轉。" },
      { title: "步驟 3: FVG 進場", desc: "等待價格回調至 FVG (不平衡區)，在此處掛單進場，目標設為對面流動性。" }
    ],
    examples: [
      {
        title: "範例 1: 倫敦時段做多 (Bullish Setup)",
        desc: "價格在 3:15 AM 掃蕩了前一小時的低點 (SSL)，隨後快速反彈突破近期高點造成 MSS。回調進入 FVG 後，價格精準反應並上漲至上方流動性池。",
        result: "Win (+3R)"
      },
      {
        title: "範例 2: 紐約時段做空 (Bearish Setup)",
        desc: "10:30 AM 數據公佈後，價格衝高掃蕩了早盤高點 (BSL)。隨後一根大陰線跌破結構。在 10:45 AM 回測 FVG 時進場做空，目標設為亞洲低點。",
        result: "Win (+2.5R)"
      }
    ]
  },
  {
    id: 2,
    title: "Asian Range Breakout",
    type: "Day Trading (日內)",
    timeframe: "M15",
    winRate: "55%",
    riskReward: "1:2",
    bestSession: "London Open (倫敦開盤)",
    indicators: "Session Indicator",
    shortDesc: "捕捉倫敦開盤時對亞洲區間高低點的假突破或真突破動能。",
    longDescription: "亞洲時段通常波動較低，形成一個緊密的價格區間。當法蘭克福或倫敦市場開盤時，波動率會急劇上升。此策略旨在利用「聰明錢」在倫敦開盤時獵取亞洲區間上下方止損單的行為。通常我們會尋找「假突破（Judas Swing）」後的反轉機會，或者強勢突破後的回測延續。",
    rules: [
      "標記亞洲時段 (Tokyo Session) 的最高與最低點。",
      "等待倫敦開盤 (Frankfurt/London Open)，觀察價格行為。",
      "情境 A (假突破)：價格突破區間邊緣後迅速收回區間內 -> 反向做單。",
      "情境 B (真突破)：價格強勢突破實體K線收盤在區間外 -> 等待回測進場。",
      "止損設在突破K線的低點/高點，或亞洲區間中軸。",
      "第一目標為亞洲區間寬度的 1 倍距離。"
    ],
    steps: [
      { title: "步驟 1: 定義區間", desc: "在圖表上框出亞洲時段 (Tokyo Session) 的最高價與最低價。" },
      { title: "步驟 2: 觀察倫敦開盤", desc: "等待 2:00-3:00 AM (EST) 的價格動作，通常會出現假突破 (Judas Swing)。" },
      { title: "步驟 3: 確認與執行", desc: "若價格收回區間內 (假突破) 則反向操作；若回測支撐有效 (真突破) 則順勢操作。" }
    ],
    examples: [
      {
        title: "範例 1: 向上假突破 (Judas Swing Short)",
        desc: "倫敦開盤後價格衝高突破亞洲高點，但在 M15 收盤時留長上影線並收回區間內。進場做空，目標亞洲低點。",
        result: "Win (+2R)"
      },
      {
        title: "範例 2: 向下真突破 (Trend Continuation)",
        desc: "價格強勢跌破亞洲低點，隨後回測該水平位並轉為阻力。在回測時進場做空，順應當日趨勢。",
        result: "Win (+2R)"
      }
    ]
  },
  {
    id: 3,
    title: "EMA Trend Pullback",
    type: "Trend Following (趨勢)",
    timeframe: "H1 / H4",
    winRate: "60%",
    riskReward: "1:1.5+",
    bestSession: "London / NY",
    indicators: "EMA 50, EMA 200, RSI",
    shortDesc: "在強趨勢市場中，利用均線回調與價格形態尋找低風險順勢機會。",
    longDescription: "這是一個經典的順勢交易策略。利用兩條指數移動平均線（EMA）來過濾趨勢方向，並在價格回調至動態支撐/壓力位（通常是 EMA 50）時進場。此策略的關鍵在於耐心等待「價格行為信號（Price Action Signal）」，如 Pinbar 或吞沒形態，以確認回調結束、趨勢重啟。",
    rules: [
      "確認大趨勢：價格 > EMA 50 > EMA 200 (多頭排列)。",
      "等待價格自然回落並觸碰/接近 EMA 50 區域。",
      "觀察 RSI 指標，確認未進入超買/超賣極端區域（避免趨勢末端）。",
      "尋找確認信號：在 EMA 附近出現 Pinbar、Hammer 或 Bullish Engulfing。",
      "信號確認後進場，止損設在信號K線低點下方。",
      "採用移動止損 (Trailing Stop) 沿著 EMA 50 保護利潤。"
    ],
    steps: [
      { title: "步驟 1: 趨勢識別", desc: "確保 EMA 50 與 EMA 200 方向一致且發散，價格位於其上方 (多頭) 或下方 (空頭)。" },
      { title: "步驟 2: 等待回調", desc: "耐心等待價格回落至 EMA 50 附近（動態價值區）。" },
      { title: "步驟 3: 觸發信號", desc: "在 EMA 附近出現明顯的反轉 K 線 (如 Pinbar) 時進場。" }
    ],
    examples: [
      {
        title: "範例 1: H1 趨勢回調做多 (Bullish Pinbar)",
        desc: "價格處於強勢上升趨勢中，回調觸碰 EMA 50 後形成標準的看漲 Pinbar。RSI 位於 50 附近未過熱。",
        result: "Win (+1.8R)"
      },
      {
        title: "範例 2: H4 趨勢延續 (Bearish Engulfing)",
        desc: "下降趨勢中，價格反彈至 EMA 50 遇阻，形成看跌吞沒形態 (Bearish Engulfing)。進場做空順勢交易。",
        result: "Win (+2.2R)"
      }
    ]
  }
];

// 策略图解组件
const StrategyDiagram = ({ id, isDark }) => {
  const strokeColor = isDark ? "#60a5fa" : "#2563eb";
  const secondaryColor = isDark ? "#34d399" : "#059669";
  const boxFill = isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(241, 245, 249, 0.5)";
  const boxStroke = isDark ? "#475569" : "#cbd5e1";

  if (id === 1) { // ICT
    return (
      <svg viewBox="0 0 300 150" className="w-full h-full">
        <line x1="20" y1="40" x2="280" y2="40" stroke={boxStroke} strokeDasharray="4" strokeWidth="1" />
        <text x="240" y="35" fontSize="10" fill={boxStroke} textAnchor="middle">Liquidity (BSL)</text>
        <path d="M20 100 L60 60 L80 80 L120 20 L140 50 L160 30 L180 90 L200 70 L220 130" fill="none" stroke={strokeColor} strokeWidth="2" />
        <circle cx="120" cy="20" r="3" fill={secondaryColor} />
        <text x="120" y="15" fontSize="10" fill={secondaryColor} textAnchor="middle">Sweep</text>
        <line x1="100" y1="80" x2="200" y2="80" stroke="red" strokeWidth="1" strokeDasharray="2" />
        <text x="215" y="83" fontSize="10" fill="red">MSS</text>
        <rect x="180" y="70" width="20" height="20" fill="rgba(255, 255, 0, 0.2)" />
        <text x="190" y="105" fontSize="10" fill={isDark ? "#fff" : "#000"} textAnchor="middle">FVG Entry</text>
      </svg>
    );
  } else if (id === 2) { // Asian Range
    return (
      <svg viewBox="0 0 300 150" className="w-full h-full">
        <rect x="50" y="50" width="100" height="50" fill={boxFill} stroke={boxStroke} strokeWidth="1" />
        <text x="100" y="78" fontSize="10" fill={boxStroke} textAnchor="middle">Asian Range</text>
        <path d="M20 75 L50 80 L80 60 L100 90 L120 60 L140 80 L150 40 L160 55" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.3" />
        <path d="M150 50 L160 80 L180 110 L200 95 L240 140" fill="none" stroke={secondaryColor} strokeWidth="2" />
        <circle cx="150" cy="40" r="3" fill="red" />
        <text x="150" y="30" fontSize="10" fill="red" textAnchor="middle">Judas Swing</text>
        <circle cx="200" cy="95" r="3" fill={strokeColor} />
        <text x="220" y="90" fontSize="10" fill={strokeColor}>Retest</text>
      </svg>
    );
  } else { // EMA
    return (
      <svg viewBox="0 0 300 150" className="w-full h-full">
        <path d="M20 120 Q 150 80 280 20" fill="none" stroke={secondaryColor} strokeWidth="2" />
        <text x="270" y="35" fontSize="10" fill={secondaryColor}>EMA 50</text>
        <path d="M20 130 L50 100 L80 110 L120 70 L150 90 L180 50 L210 65 L250 10" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="150" cy="90" r="4" fill="transparent" stroke="red" strokeWidth="2" />
        <text x="150" y="110" fontSize="10" fill={isDark ? "#fff" : "#000"} textAnchor="middle">Pullback & Signal</text>
      </svg>
    );
  }
};

// 策略卡片组件
const StrategyCard = ({ data, onClick, isDark }) => (
  <div
    onClick={() => onClick(data)}
    className={`p-5 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden
      ${isDark
        ? 'bg-slate-800 border-slate-700 hover:border-emerald-500/50 hover:shadow-emerald-900/20'
        : 'bg-white border-gray-200 hover:border-emerald-400/50 hover:shadow-emerald-100'
      }`}
  >
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}>
      <TrendingUp className="h-16 w-16" strokeWidth={1} />
    </div>

    <div className="flex justify-between items-start mb-4 relative z-10">
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
        ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
        {data.type.split(' ')[0]}
      </span>
      <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {data.timeframe}
      </span>
    </div>

    <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-500 transition-colors relative z-10">{data.title}</h3>
    <p className={`text-sm mb-6 line-clamp-2 h-10 ${isDark ? 'text-slate-400' : 'text-slate-500'} relative z-10`}>
      {data.shortDesc}
    </p>

    <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-200 dark:border-slate-700 relative z-10">
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-widest opacity-50 mb-0.5">Win Rate</span>
        <span className={`font-mono font-bold text-lg ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{data.winRate}</span>
      </div>
      <div className="flex flex-col text-right">
        <span className="text-[9px] uppercase tracking-widest opacity-50 mb-0.5">R:R Ratio</span>
        <span className={`font-mono font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{data.riskReward}</span>
      </div>
    </div>
  </div>
);

// 策略详情组件
const StrategyDetail = ({ data, onBack, isDark }) => {
  const [checkedState, setCheckedState] = useState(new Array(data.rules.length).fill(false));

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const progress = Math.round((checkedState.filter(Boolean).length / data.rules.length) * 100);
  const isReady = progress === 100;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-colors border ${isDark ? 'hover:bg-slate-700 text-slate-400 border-slate-700' : 'hover:bg-gray-100 text-slate-500 border-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
          <div className="flex items-center gap-2 text-xs opacity-60 mt-1">
            <span className="uppercase font-bold tracking-wider">{data.type}</span>
            <span>•</span>
            <span className="font-mono">{data.timeframe}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="flex flex-col gap-6">

          {/* 策略核心簡介卡片 */}
          <div className={`p-6 rounded-xl border relative overflow-hidden
            ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-800/50 border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>

            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-blue-500">📖</span> 策略核心邏輯
            </h3>
            <p className={`text-sm leading-7 mb-6 text-justify ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {data.longDescription}
            </p>

            {/* 關鍵數據儀表板 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="text-[9px] opacity-50 uppercase tracking-wider mb-1">最佳時段</div>
                <div className="font-bold text-xs truncate" title={data.bestSession}>{data.bestSession}</div>
              </div>
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="text-[9px] opacity-50 uppercase tracking-wider mb-1">關鍵指標</div>
                <div className="font-bold text-xs truncate" title={data.indicators}>{data.indicators}</div>
              </div>
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="text-[9px] opacity-50 uppercase tracking-wider mb-1">盈虧比</div>
                <div className="font-bold text-xs text-blue-500">{data.riskReward}</div>
              </div>
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="text-[9px] opacity-50 uppercase tracking-wider mb-1">歷史勝率</div>
                <div className="font-bold text-xs text-emerald-500">{data.winRate}</div>
              </div>
            </div>
          </div>

          {/* 圖解詳解 & 檢查表 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* 左側：策略圖解與詳解 */}
            <div className={`lg:col-span-7 p-6 rounded-xl border flex flex-col gap-6
              ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>

              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="text-amber-500">🗺️</span> 策略圖解與詳解
              </h3>

              {/* SVG 圖解區域 */}
              <div className={`w-full aspect-[2/1] rounded-lg border flex items-center justify-center p-4 relative overflow-hidden
                ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-200'}`}>
                <StrategyDiagram id={data.id} isDark={isDark} />
              </div>

              {/* 分步詳解 */}
              <div className="space-y-4">
                {data.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
                      ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-emerald-100 text-emerald-600'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{step.title}</h4>
                      <p className={`text-xs mt-1 leading-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右側：檢查表 */}
            <div className={`lg:col-span-5 p-6 rounded-xl border flex flex-col h-fit sticky top-6
              ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="text-emerald-500">✅</span> 執行檢查表
                </h3>
                <span className={`font-mono text-xs px-2 py-1 rounded ${isReady ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 opacity-60'}`}>
                  {progress}%
                </span>
              </div>

              {/* 進度條 */}
              <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${isReady ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                {data.rules.map((rule, index) => (
                  <label
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all group select-none
                      ${checkedState[index]
                        ? (isDark ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                        : (isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-gray-50 border-gray-200 hover:border-emerald-300')}`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0
                      ${checkedState[index]
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 dark:border-slate-600 bg-transparent group-hover:border-emerald-400'}`}>
                      {checkedState[index] && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs font-medium leading-5 ${checkedState[index] ? (isDark ? 'text-emerald-400' : 'text-emerald-800') : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>
                      {rule}
                    </span>
                    <input
                      type="checkbox"
                      checked={checkedState[index]}
                      onChange={() => handleOnChange(index)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>

              {isReady && (
                <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-center animate-bounce shadow-lg shadow-emerald-500/10">
                  <div className="font-bold text-lg flex items-center justify-center gap-2">
                    <Target size={20} /> Setup Confirmed
                  </div>
                  <div className="text-xs opacity-80 mt-1">所有條件已滿足，請按照風險控管計畫進場。</div>
                </div>
              )}
            </div>
          </div>

          {/* 實戰範例 */}
          <div className="mt-6">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <span className="text-purple-500">💡</span> 實戰範例
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.examples.map((ex, idx) => (
                <div key={idx} className={`p-5 rounded-xl border flex flex-col gap-3
                  ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{ex.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold
                      ${ex.result.includes('Win') ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : 'bg-red-100 text-red-700'}`}>
                      {ex.result}
                    </span>
                  </div>
                  <div className={`w-full aspect-[2/1] rounded-lg border border-dashed flex items-center justify-center
                    ${isDark ? 'bg-slate-900/50 border-slate-600' : 'bg-gray-50 border-gray-300'}`}>
                    <div className="text-center opacity-40">
                      <TrendingUp className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-[10px]">範例圖表截圖</span>
                    </div>
                  </div>
                  <p className={`text-xs leading-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {ex.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主组件
export default function TradingStrategySection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  return (
    <section id="courses" className="relative py-24 overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {!selectedStrategy ? (
          <>
            {/* Section Header */}
            <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                交易策略專區
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                選擇您的武器，嚴格執行標準化流程
              </p>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
              {strategies.map(strategy => (
                <StrategyCard key={strategy.id} data={strategy} onClick={setSelectedStrategy} isDark={isDark} />
              ))}

              {/* 持續更新中 Placeholder */}
              <div className={`p-5 rounded-xl border border-dashed flex flex-col items-center justify-center text-center min-h-[200px] select-none
                ${isDark ? 'border-slate-700 bg-slate-800/20' : 'border-gray-300 bg-gray-50/50'}`}>
                <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800 text-emerald-500' : 'bg-white text-emerald-500 shadow-sm'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-[spin_3s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>策略庫持續更新中...</h3>
                <p className={`text-xs opacity-60 max-w-[200px] leading-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  我們將陸續收錄更多高勝率的 SMC、Price Action 與機構訂單流策略。
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-[1400px] mx-auto h-[900px]">
            <StrategyDetail data={selectedStrategy} onBack={() => setSelectedStrategy(null)} isDark={isDark} />
          </div>
        )}
      </div>
    </section>
  );
}
