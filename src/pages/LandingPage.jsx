import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Monitor, ShieldCheck, CreditCard, GraduationCap, Copy, Check, Menu, X, ArrowRight, BarChart2, MessageCircle, DollarSign, Terminal, TrendingUp, Star, Zap, ChevronRight, ChevronDown, Code, Cpu, Sun, Moon, Users, Award, Target, ExternalLink, Tag, Calendar, Calculator, Wrench } from 'lucide-react';
import { partners } from '../data/partners';
import { propFirms } from '../data/propFirms';
import { teamMembers } from '../data/teamMembers';
import { PROP_FIRM_DISCOUNTS } from '../data/discounts';

const PropFirmDiscountRow = ({ firm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(firm.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorClasses = {
    emerald: {
      logoBg: 'bg-emerald-500',
      border: 'hover:border-emerald-500/50',
      shadow: 'hover:shadow-emerald-500/10'
    },
    blue: {
      logoBg: 'bg-blue-500',
      border: 'hover:border-blue-500/50',
      shadow: 'hover:shadow-blue-500/10'
    },
    purple: {
      logoBg: 'bg-purple-500',
      border: 'hover:border-purple-500/50',
      shadow: 'hover:shadow-purple-500/10'
    },
    indigo: {
      logoBg: 'bg-indigo-500',
      border: 'hover:border-indigo-500/50',
      shadow: 'hover:shadow-indigo-500/10'
    },
    amber: {
      logoBg: 'bg-amber-500',
      border: 'hover:border-amber-500/50',
      shadow: 'hover:shadow-amber-500/10'
    }
  };

  const colors = colorClasses[firm.color];

  return (
    <div className={`group bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 ${colors.border} transition-all duration-300 ${colors.shadow} hover:shadow-lg hover:-translate-y-1 p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-hidden`}>
      {/* Decorative Left Border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.logoBg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

      {/* Rank & Firm Name (Col Span 4) */}
      <div className="md:col-span-4 flex items-center gap-4 pl-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-sm font-black text-slate-600 dark:text-slate-400">#{firm.rank}</span>
        </div>
        <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md ${colors.logoBg} font-black text-white text-sm group-hover:scale-110 transition-transform`}>
          {firm.logo}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {firm.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{firm.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({firm.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Discount Offer (Col Span 3) */}
      <div className="md:col-span-3 md:border-l border-slate-200 dark:border-slate-700 md:pl-6">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Special Offer</p>
        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
          {firm.discount}
        </p>
      </div>

      {/* Promo Code (Col Span 3) */}
      <div className="md:col-span-3 md:pr-2">
        <div className="flex items-stretch h-10">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-l-md border border-r-0 border-slate-200 dark:border-slate-700 flex items-center justify-center px-3">
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm tracking-wide select-all">
              {firm.code}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 rounded-r-md font-semibold text-xs transition-all duration-200 flex items-center gap-2 min-w-[80px] justify-center
              ${copied
                ? 'bg-green-600 text-white'
                : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600'
              }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                已複製
              </>
            ) : (
              <>
                <Copy size={14} />
                複製
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Button (Col Span 2) */}
      <div className="md:col-span-2 flex justify-end">
        <a
          href={firm.link}
          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:gap-2 transition-all group/link"
        >
          查看優惠
          <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

// 五邊形雷達圖組件
const RadarChart = ({ stats, color }) => {
  const labels = ['價格', '規則', '出金', '平台', '客服'];
  const values = [stats.price, stats.rules, stats.withdrawal, stats.platform, stats.support];

  // 計算五邊形的點座標 (增加中心点和半径以留出标签空间)
  const center = 60; // 中心点位置
  const maxRadius = 35; // 最大半径，留出更多空间给标签

  const getPoint = (value, index) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // 從頂部開始
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  };

  // 生成五邊形路徑
  const dataPath = values.map((value, index) => getPoint(value, index)).join(' ');

  // 生成背景網格（5個層級）
  const gridLevels = [20, 40, 60, 80, 100];

  const getGridPoint = (percentage, index) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const radius = (percentage / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  };

  // 顏色映射
  const colorMap = {
    blue: { fill: 'rgba(59, 130, 246, 0.2)', stroke: 'rgb(59, 130, 246)', grid: 'rgba(148, 163, 184, 0.15)' },
    emerald: { fill: 'rgba(16, 185, 129, 0.2)', stroke: 'rgb(16, 185, 129)', grid: 'rgba(148, 163, 184, 0.15)' },
    purple: { fill: 'rgba(168, 85, 247, 0.2)', stroke: 'rgb(168, 85, 247)', grid: 'rgba(148, 163, 184, 0.15)' }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-36 h-36">
        {/* 背景網格 */}
        {gridLevels.map((level, levelIndex) => (
          <polygon
            key={levelIndex}
            points={[0, 1, 2, 3, 4].map(i => getGridPoint(level, i)).join(' ')}
            fill="none"
            stroke={colors.grid}
            strokeWidth="0.3"
          />
        ))}

        {/* 連接中心點到各頂點的線 */}
        {[0, 1, 2, 3, 4].map(i => {
          const point = getGridPoint(100, i).split(',');
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point[0]}
              y2={point[1]}
              stroke={colors.grid}
              strokeWidth="0.3"
            />
          );
        })}

        {/* 數據填充區域 */}
        <polygon
          points={dataPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* 數據點 */}
        {values.map((value, index) => {
          const [x, y] = getPoint(value, index).split(',');
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={colors.stroke}
            />
          );
        })}

        {/* 標籤 */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
          const labelRadius = 52; // 标签距离中心的半径，确保在图表外围
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);

          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[7px] fill-slate-700 dark:fill-slate-300 font-bold"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const FirmCard = ({ firm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(firm.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 定義主題色樣式
  const isFutures = firm.theme === 'blue';
  const themeColors = {
    badgeBg: isFutures ? 'bg-blue-500/10' : firm.theme === 'purple' ? 'bg-purple-500/10' : 'bg-emerald-500/10',
    badgeText: isFutures ? 'text-blue-400' : firm.theme === 'purple' ? 'text-purple-400' : 'text-emerald-400',
    borderHover: isFutures ? 'group-hover:border-blue-500/50' : firm.theme === 'purple' ? 'group-hover:border-purple-500/50' : 'group-hover:border-emerald-500/50',
    buttonGradient: isFutures
      ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
      : firm.theme === 'purple'
        ? 'from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-900/20'
        : 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20',
    glow: isFutures ? 'from-blue-500/5' : firm.theme === 'purple' ? 'from-purple-500/5' : 'from-emerald-500/5'
  };

  return (
    <div className={`relative group bg-white dark:bg-[#0F172A]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 ${themeColors.borderHover} hover:shadow-2xl hover:-translate-y-1`}>

      {/* 頂部發光背景 */}
      <div className={`absolute inset-0 bg-gradient-to-b ${themeColors.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

      <div className="p-6 relative z-10 flex flex-col h-full">
        {/* 頭部標籤 */}
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-md text-[10px] font-bold border border-white/5 uppercase tracking-wider ${themeColors.badgeBg} ${themeColors.badgeText} flex items-center gap-1.5`}>
            {firm.type === 'Futures' ? <Terminal size={12}/> : <BarChart2 size={12}/>}
            {firm.type}
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/5 px-2 py-1 rounded border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <Star size={12} fill="currentColor" />
            {firm.rating}
          </div>
        </div>

        {/* 公司名稱與價格 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-tight font-display">{firm.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{firm.price}</span>
            <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">{firm.billingCycle} 起</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isFutures ? 'bg-blue-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`}></div>
            {firm.bestFor}
          </div>
        </div>

        {/* 能力值雷達圖 */}
        <div className="mb-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/50">
          <div className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-3 text-center">綜合能力評估</div>
          <RadarChart stats={firm.stats} color={firm.theme} />
        </div>

        {/* 特色列表 */}
        <div className="space-y-4 mb-6 flex-grow">
          <div>
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-600 uppercase tracking-widest mb-2">Platform</div>
            <div className="pl-0">
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-[#0B1120] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Monitor size={12} className="text-slate-500 dark:text-slate-500" />
                <span className="truncate">{firm.platform}</span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {firm.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                <div className={`mt-1 p-0.5 rounded-full ${themeColors.badgeBg}`}>
                  <Check size={10} className={themeColors.badgeText} />
                </div>
                <span className="leading-snug text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部行動區 */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50">
          <div className="bg-slate-100 dark:bg-[#0B1120] p-1.5 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-800 mb-3 relative overflow-hidden">
            <div className="pl-2">
              <p className="text-[10px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-wider">Code</p>
              <p className={`font-mono font-bold tracking-widest text-sm ${themeColors.badgeText}`}>{firm.code}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              title="複製折扣碼"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          <button className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg bg-gradient-to-r ${themeColors.buttonGradient} flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] border border-white/10`}>
            開始測評 <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredFirms = activeTab === 'all'
    ? propFirms
    : propFirms.filter(firm => firm.type.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050911] text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">

      {/* 全局背景網格 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
      </div>

      {/* 注入動畫樣式 */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .glass-nav {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .dark .glass-nav {
          background: rgba(5, 9, 17, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-nav">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300">
              <Terminal className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors flex items-center gap-0.5">
              Prop<span className="text-emerald-500">Hack</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-3"></span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            {/* 新手入門 - 下拉菜單 */}
            <div className="relative group">
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors relative py-2 flex items-center gap-1">
                新手入門
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </button>

              {/* 下拉菜單 */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link to="/knowledge" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/item">
                  <BookOpen size={18} className="text-emerald-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Propfirm基礎知識</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">CFD vs 期貨規則</div>
                  </div>
                </Link>
                <Link to="/platform" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/item">
                  <Monitor size={18} className="text-blue-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">平臺設置</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">MT5/Rithmic 教程</div>
                  </div>
                </Link>
                <Link to="/withdrawal" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/item">
                  <CreditCard size={18} className="text-purple-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">付款出金流程</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Deel/加密貨幣</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Propfirm測評 */}
            <a href="#firms" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
              Propfirm測評
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </a>

            {/* 折扣中心 */}
            <a href="#discounts" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
              折扣中心
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </a>

            {/* 資源工具 - 下拉菜單 */}
            <div className="relative group">
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors relative py-2 flex items-center gap-1">
                資源工具
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </button>

              {/* 下拉菜單 */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <a href="#calendar" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/item">
                  <Calendar size={18} className="text-orange-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">財經日曆</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">即時經濟數據</div>
                  </div>
                </a>
                <a href="#calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/item">
                  <Calculator size={18} className="text-cyan-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">倉位風險計算器</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">精準計算倉位</div>
                  </div>
                </a>
                <a href="#tools" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/item">
                  <Wrench size={18} className="text-indigo-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">推薦工具</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">精選交易工具</div>
                  </div>
                </a>
              </div>
            </div>

            {/* 交易策略專區 */}
            <a href="#courses" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
              交易策略專區
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white"
              title={theme === 'dark' ? "切換至日間模式" : "切換至夜間模式"}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 border border-white/5"
            >
              <BarChart2 size={18} />
              Propfirm績效記錄
            </Link>
            <button className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 border border-white/5">
              <MessageCircle size={18} />
              加入 Discord
            </button>
          </div>

          <button className="md:hidden text-slate-700 dark:text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-5">
            {/* 新手入門 */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1">新手入門</div>
              <Link to="/knowledge" className="block py-2 px-4 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg font-medium text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-500" />
                Propfirm基礎知識
              </Link>
              <Link to="/platform" className="block py-2 px-4 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg font-medium text-sm flex items-center gap-2">
                <Monitor size={16} className="text-blue-500" />
                平臺設置
              </Link>
              <Link to="/withdrawal" className="block py-2 px-4 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg font-medium text-sm flex items-center gap-2">
                <CreditCard size={16} className="text-purple-500" />
                付款出金流程
              </Link>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

            {/* 其他菜單項 */}
            <a href="#firms" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">Propfirm測評</a>
            <a href="#discounts" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium" onClick={() => setIsMenuOpen(false)}>折扣中心</a>

            {/* 資源工具 */}
            <div className="space-y-1 mt-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1">資源工具</div>
              <a href="#calendar" className="block py-2 px-4 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg font-medium text-sm flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <Calendar size={16} className="text-orange-500" />
                財經日曆
              </a>
              <a href="#calculator" className="block py-2 px-4 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg font-medium text-sm flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <Calculator size={16} className="text-cyan-500" />
                倉位風險計算器
              </a>
              <a href="#tools" className="block py-2 px-4 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg font-medium text-sm flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <Wrench size={16} className="text-indigo-500" />
                推薦工具
              </a>
            </div>

            <a href="#courses" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">交易策略專區</a>

            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

            <Link to="/dashboard" className="block py-2 px-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium">Propfirm績效記錄</Link>
            <a href="#" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">Discord 社群</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="pt-36 pb-24 px-6 relative overflow-hidden z-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-60"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen opacity-50"></div>

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/40 transition-colors cursor-pointer group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="group-hover:text-emerald-300 transition-colors">System Update: Topstep 1折優惠中</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>

          {/* UPDATED: Headline and Subtext */}
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tighter">
            深度解密 <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x">PROP FIRMS</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            <span className="text-emerald-500 dark:text-emerald-400 font-bold">PropHack</span> 致力於為交易員提供最專業的深度剖析。我們挖掘每一條隱藏條款與魔鬼細節,客觀評測平臺優劣,助您看清真相,在規則迷宮中做出最明智的資金帳戶選擇。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1">
              <Zap size={20} className="fill-slate-950" />
              查看推薦平臺
            </button>
            <button className="bg-slate-100 dark:bg-[#111827]/80 hover:bg-slate-200 dark:hover:bg-[#1f2937] backdrop-blur text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg border border-slate-300 dark:border-slate-700 hover:border-emerald-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <BookOpen size={20} />
              新手入門指南
            </button>
          </div>

          {/* New Scrolling Trust Indicators (Logos Marquee) */}
          <div className="mt-24 border-t border-slate-200 dark:border-slate-800/50 pt-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-[#050911] px-4 text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Supported Platforms</div>

            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              {/* List 1 */}
              <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 [&_li]:max-w-none animate-infinite-scroll">
                {partners.map((partner, index) => (
                  <li key={index}>
                     <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer group/logo">
                        <span className={`text-slate-600 dark:text-slate-300 group-hover/logo:text-slate-900 dark:group-hover/logo:text-white transition-colors ${partner.style}`}>
                          {partner.name}
                        </span>
                     </div>
                  </li>
                ))}
              </ul>
              {/* List 2 (Duplicate for seamless loop) */}
              <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 [&_li]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {partners.map((partner, index) => (
                  <li key={`dup-${index}`}>
                     <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer group/logo">
                        <span className={`text-slate-600 dark:text-slate-300 group-hover/logo:text-slate-900 dark:group-hover/logo:text-white transition-colors ${partner.style}`}>
                          {partner.name}
                        </span>
                     </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </header>

      {/* About Us Section */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute left-1/4 top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute right-1/4 bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                <ShieldCheck size={16} />
                關於我們
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
                從交易員到<span className="text-emerald-500">破局者</span>
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                我們不是理論派，而是在 Prop Firm 戰場上摸爬滾打 4 年的實戰老兵。<br className="hidden md:block" />
                經歷過 MyForexFunds 倒閉、破解過無數隱藏規則、成功出金超過 $150K。<br className="hidden md:block" />
                現在，我們將所有血淚經驗系統化，幫助你少走 90% 的彎路。
              </p>
            </div>

            {/* Team Member Cards */}
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Users className="text-emerald-500" size={24} />
                  核心團隊成員
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-[#111827]/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity ${
                      member.color === 'emerald' ? 'bg-emerald-500/10' :
                      member.color === 'blue' ? 'bg-blue-500/10' :
                      'bg-purple-500/10'
                    }`}></div>

                    {/* Icon Badge */}
                    <div className="flex justify-center mb-5">
                      <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-2 shadow-lg relative z-10 ${
                        member.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' :
                        member.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' :
                        'bg-purple-500/10 border-purple-500/30'
                      }`}>
                        {React.createElement(member.icon, {
                          size: 40,
                          className: member.color === 'emerald' ? 'text-emerald-500' :
                                    member.color === 'blue' ? 'text-blue-500' :
                                    'text-purple-500'
                        })}
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="text-center mb-4 relative z-10">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h4>
                      <p className={`text-sm font-semibold mb-2 ${
                        member.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                        member.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`}>
                        {member.role}
                      </p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
                        member.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                        member.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20' :
                        'bg-purple-500/10 border border-purple-500/20'
                      }`}>
                        <Award size={12} className={
                          member.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                          member.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          'text-purple-600 dark:text-purple-400'
                        } />
                        <span className={`font-bold ${
                          member.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                          member.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`}>
                          {member.experience}
                        </span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4 relative z-10">
                      <h5 className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">專業領域</h5>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="relative z-10">
                      <h5 className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">核心成就</h5>
                      <ul className="space-y-2">
                        {member.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              member.color === 'emerald' ? 'bg-emerald-500' :
                              member.color === 'blue' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`}></div>
                            <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Discount Center Section */}
      <section id="discounts" className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
                <Zap size={16} className="fill-amber-600 dark:fill-amber-400" />
                折扣中心
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                獨家 <span className="text-amber-500">折扣優惠</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                使用我們的專屬折扣碼，以最低成本開啟您的 Prop Firm 交易之旅。
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mb-1">{PROP_FIRM_DISCOUNTS.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">專屬優惠</div>
              </div>
              <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">最高50%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">折扣優惠</div>
              </div>
              <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">即時</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">立即使用</div>
              </div>
              <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">每週</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">更新優惠</div>
              </div>
            </div>
          </div>

          {/* Table Header (Desktop Only) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">排名</div>
            <div className="col-span-4">Firm 名稱 / 評價</div>
            <div className="col-span-3">折扣優惠</div>
            <div className="col-span-2">優惠碼</div>
            <div className="col-span-2 text-right">操作</div>
          </div>

          {/* Discount List */}
          <div className="flex flex-col gap-4">
            {PROP_FIRM_DISCOUNTS.map(firm => (
              <PropFirmDiscountRow key={firm.id} firm={firm} />
            ))}
          </div>
        </div>
      </section>

      {/* Prop Firm Directory */}
      <section id="firms" className="py-24 px-6 relative z-10 bg-slate-100 dark:bg-[#0B1120]/50 border-y border-slate-200 dark:border-slate-800">
        {/* Decorative elements */}
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                 <Zap className="text-amber-400 fill-amber-400" size={16} />
                 <span className="text-amber-400 dark:text-amber-400 font-bold tracking-wide uppercase text-xs">Editor's Choice</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">精選 Prop Firm 測評</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">實時更新規則、價格與隱藏條款,拒絕資訊不對稱</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-[#111827] p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 flex shadow-inner">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
              >
                全部
              </button>
              <button
                onClick={() => setActiveTab('futures')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'futures' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
              >
                <Terminal size={14} /> 期貨 (Futures)
              </button>
              <button
                onClick={() => setActiveTab('cfd')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'cfd' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
              >
                <BarChart2 size={14} /> 差價合約 (CFD)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFirms.map(firm => (
              <FirmCard key={firm.id} firm={firm} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all font-medium flex items-center gap-2 mx-auto group">
               查看完整評測報告 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Community / Discord CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto bg-gradient-to-r from-[#5865F2] to-[#404EED] rounded-[2.5rem] p-12 md:p-24 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(88,101,242,0.3)] group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px] group-hover:blur-[60px] transition-all duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl">
              <div className="inline-block bg-indigo-800/30 text-indigo-100 dark:text-indigo-100 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-indigo-400/30 backdrop-blur-md">
                🚀 已有 1,200+ 交易員加入
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white dark:text-white mb-6 leading-tight">加入 <span className="underline decoration-wavy decoration-emerald-400/50">PropHack</span> 中文社群</h2>
              <p className="text-indigo-100 dark:text-indigo-100 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                不再孤軍奮戰。獲取每週市場分析報告、獨家折扣碼提醒,以及來自通關交易員的實戰經驗分享。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                 {['獨家 1折 優惠碼', '每週日市場分析', '出金狀態預警', '軟體技術支援'].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-white font-bold bg-white/10 p-3 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <Check className="text-white" size={18} /> {item}
                   </div>
                 ))}
              </div>

              <button className="bg-white text-[#5865F2] hover:bg-indigo-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-900/30 hover:scale-105 active:scale-95 flex items-center gap-3">
                <MessageCircle size={24} />
                立即免費加入 Discord
              </button>
            </div>

            {/* Mock Discord UI */}
            <div className="w-full max-w-md perspective-1000 hidden md:block">
              <div className="bg-[#1e2124]/95 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl transform md:rotate-y-12 md:rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out">
                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">PH</div>
                  <div>
                    <div className="font-bold text-white text-lg">PropHack VIP</div>
                    <div className="text-sm text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 1,240 在線</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#282b30] p-3 rounded-xl border border-white/5 hover:bg-[#36393e] transition-colors">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold text-emerald-400">@Admin</span>
                      <span>剛剛</span>
                    </div>
                    <p className="text-sm text-slate-200">⚠️ <span className="text-amber-400 font-bold">Topstep</span> 剛剛發布了新規則,禁止新聞交易的時間改為前後2分鐘,請大家注意風控!</p>
                  </div>
                  <div className="bg-[#282b30] p-3 rounded-xl border border-white/5 hover:bg-[#36393e] transition-colors">
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold text-blue-400">@Trader_Jack</span>
                      <span>2分鐘前</span>
                    </div>
                    <p className="text-sm text-slate-200">感謝群主分享的 NinjaTrader 設置教學,終於連上 Rithmic 數據了!🚀</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-[#02040a] py-16 px-6 border-t border-slate-200 dark:border-slate-900 relative z-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg">
                <Terminal className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Prop<span className="text-emerald-500 dark:text-emerald-500">Hack</span></span>
            </div>
            <p className="text-slate-600 dark:text-slate-500 max-w-sm text-sm leading-relaxed mb-6 font-medium">
              致力於幫助交易員通過 Prop Firm 考核,獲取即時資訊與技術支持。我們堅信,正確的工具與社群能讓交易之路不再艱難。
            </p>
            <div className="flex gap-4">
               {/* Social Icons placeholder */}
               <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/20"><MessageCircle size={18}/></div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-lg tracking-tight">快速鏈接</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="/knowledge" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> Propfirm 基礎知識</a></li>
              <li><a href="/platform" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 平臺設置</a></li>
              <li><a href="/withdrawal" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 付款出金流程</a></li>
              <li><a href="#firms" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> Propfirm測評</a></li>
              <li><a href="#discounts" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 折扣中心</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-lg tracking-tight">資源工具</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#calendar" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 財經日曆</a></li>
              <li><a href="#calculator" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 倉位風險計算器</a></li>
              <li><a href="#tools" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 推薦工具</a></li>
              <li><a href="#courses" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/> 交易策略專區</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-900 text-center text-slate-500 dark:text-slate-600 text-xs font-medium flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2024 PropHack. All rights reserved.</span>
          <div className="flex gap-6">
             <a href="#" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">隱私政策</a>
             <a href="#" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">服務條款</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
