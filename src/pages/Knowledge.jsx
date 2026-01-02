import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Sun, Moon, BookOpen, BarChart2, Terminal, Check, ChevronDown, Globe, XCircle, CheckCircle, Circle, Triangle, Calculator } from 'lucide-react';

export default function Knowledge() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('CFD');
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Futures Propfirm地區限制數據（來源：官方數據）
  // 狀態: 'open' = ○開放, 'banned' = ❌禁止, 'simulation' = △模擬
  const futuresPropfirmRestrictions = [
    { name: 'Tradeify', china: 'simulation', hongkong: 'simulation', taiwan: 'open', korea: 'simulation', japan: 'open', malaysia: 'banned', singapore: 'open', thailand: 'open', australia: 'open', canada: 'simulation', us: 'open', uk: 'open' },
    { name: 'Topstep', china: 'open', hongkong: 'simulation', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'Apex', china: 'banned', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'MyFunded (MFFU)', china: 'banned', hongkong: 'banned', taiwan: 'banned', korea: 'open', japan: 'open', malaysia: 'banned', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'E8 Markets', china: 'banned', hongkong: 'banned', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'FundingTicks', china: 'banned', hongkong: 'banned', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'simulation', us: 'open', uk: 'simulation' },
    { name: 'FundedNext', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'banned', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'Alpha', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'banned', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'TradeDay', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'TakeProfit', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'Lucid Trading', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
  ];

  // CFD Propfirm地區限制數據（來源：官方數據）
  // 狀態: 'open' = ○開放, 'banned' = ❌禁止, 'simulation' = △模擬
  const cfdPropfirmRestrictions = [
    { name: 'FundedNext', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'banned', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'simulation', uk: 'open' },
    { name: 'E8 Markets', china: 'open', hongkong: 'banned', taiwan: 'simulation', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'simulation', uk: 'open' },
    { name: 'Alpha Capital', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'FundingPips', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'OANDA Prop Trader', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
    { name: 'ATFunded', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'banned', uk: 'open' },
    { name: 'FTMO', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'simulation', canada: 'open', us: 'simulation', uk: 'open' },
    { name: 'The5ers', china: 'open', hongkong: 'open', taiwan: 'open', korea: 'open', japan: 'open', malaysia: 'open', singapore: 'open', thailand: 'open', australia: 'open', canada: 'open', us: 'open', uk: 'open' },
  ];

  // 渲染狀態圖標的輔助函數
  const renderStatusIcon = (status) => {
    switch(status) {
      case 'open':
        return <Circle className="text-emerald-500 fill-emerald-500" size={20} />;
      case 'banned':
        return <XCircle className="text-rose-500" size={20} />;
      case 'simulation':
        return <Triangle className="text-amber-500 fill-amber-500" size={20} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (location.hash === '#comparison') {
      // 添加延遲確保 DOM 已經渲染
      setTimeout(() => {
        const element = document.getElementById('comparison');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050911] text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">
      {/* 全局背景網格 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
      </div>

      {/* 導航欄 */}
      <nav className="fixed w-full z-50 bg-slate-50/80 dark:bg-[#050911]/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <BookOpen className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              Prop<span className="text-emerald-500">Hack</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white"
              title={theme === 'dark' ? "切換至日間模式" : "切換至夜間模式"}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-emerald-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white font-medium text-sm"
            >
              <Home size={18} />
              返回首頁
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-8 border border-emerald-500/20">
              <BookOpen size={20} />
              基礎知識學院
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tighter">
              基礎知識
            </h1>
          </div>

          {/* 詳細內容區 */}
          <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Category Tabs */}
            <div className="flex justify-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl gap-2">
                <button
                  onClick={() => setActiveCategory('CFD')}
                  className={`px-8 py-3 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                    activeCategory === 'CFD'
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-900/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <BarChart2 size={18} />
                  CFD (差價合約)
                </button>
                <button
                  onClick={() => setActiveCategory('Futures')}
                  className={`px-8 py-3 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                    activeCategory === 'Futures'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Terminal size={18} />
                  Futures (期貨)
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-12">
              {activeCategory === 'CFD' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
                  {/* Expandable Q&A Section */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('cfd-geo-restrictions')}
                      className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10 hover:from-emerald-100 hover:to-cyan-100 dark:hover:from-emerald-900/20 dark:hover:to-cyan-900/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <Globe size={24} className="text-emerald-500" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">自營交易公司（Propfirm）地區限制對照表</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">查看各家 CFD Propfirm 的全球地區接受情況</p>
                        </div>
                      </div>
                      <ChevronDown
                        size={24}
                        className={`text-emerald-500 transition-transform duration-300 ${expandedSection === 'cfd-geo-restrictions' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expandedSection === 'cfd-geo-restrictions' && (
                      <div className="p-6 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                <th className="text-left p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900/50 z-10">
                                  Propfirm
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇨🇳</span>
                                    <span className="text-xs">中國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇭🇰</span>
                                    <span className="text-xs">香港</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇹🇼</span>
                                    <span className="text-xs">台灣</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇰🇷</span>
                                    <span className="text-xs">韓國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇯🇵</span>
                                    <span className="text-xs">日本</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇲🇾</span>
                                    <span className="text-xs">馬來西亞</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇸🇬</span>
                                    <span className="text-xs">新加坡</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇹🇭</span>
                                    <span className="text-xs">泰國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇦🇺</span>
                                    <span className="text-xs">澳洲</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇨🇦</span>
                                    <span className="text-xs">加拿大</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇺🇸</span>
                                    <span className="text-xs">美國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇬🇧</span>
                                    <span className="text-xs">英國</span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {cfdPropfirmRestrictions.map((firm, index) => (
                                <tr
                                  key={firm.name}
                                  className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                                    index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''
                                  }`}
                                >
                                  <td className="p-4 font-semibold text-slate-900 dark:text-white sticky left-0 bg-inherit z-10">
                                    {firm.name}
                                  </td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.china)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.hongkong)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.taiwan)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.korea)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.japan)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.malaysia)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.singapore)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.thailand)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.australia)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.canada)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.us)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.uk)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-center">符號說明與備註</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                              <Circle className="text-emerald-500 fill-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-1">○ 開放</div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">完全參與資格，可獲實盤資金。</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800">
                              <XCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <div className="font-bold text-rose-700 dark:text-rose-400 text-sm mb-1">❌ 禁止</div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">完全禁止居住於該地的個人或實體訪問服務。</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                              <Triangle className="text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <div className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-1">△ 模擬</div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">僅具備模擬帳戶資格，合約期間無法轉換為真人實盤。</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            <strong className="text-emerald-600 dark:text-emerald-400">注意：</strong> 地區限制可能會隨時變動，建議在註冊前先到官網確認最新政策。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coming Soon Message */}
                  <div className="text-center mt-8 p-8 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                      <BarChart2 size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">更多 CFD 內容即將推出</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      更多優質內容包括交易規則、平台使用教學、風險管理等正在準備中
                    </p>
                  </div>
                </div>
              )}

              {activeCategory === 'Futures' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
                  {/* Expandable Q&A Section */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('geo-restrictions')}
                      className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Globe size={24} className="text-blue-500" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">自營交易公司（Propfirm）地區限制對照表</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">查看各家期貨 Propfirm 的全球地區接受情況</p>
                        </div>
                      </div>
                      <ChevronDown
                        size={24}
                        className={`text-blue-500 transition-transform duration-300 ${expandedSection === 'geo-restrictions' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expandedSection === 'geo-restrictions' && (
                      <div className="p-6 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                <th className="text-left p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900/50 z-10">
                                  Propfirm
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇨🇳</span>
                                    <span className="text-xs">中國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇭🇰</span>
                                    <span className="text-xs">香港</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇹🇼</span>
                                    <span className="text-xs">台灣</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇰🇷</span>
                                    <span className="text-xs">韓國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇯🇵</span>
                                    <span className="text-xs">日本</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇲🇾</span>
                                    <span className="text-xs">馬來西亞</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇸🇬</span>
                                    <span className="text-xs">新加坡</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇹🇭</span>
                                    <span className="text-xs">泰國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇦🇺</span>
                                    <span className="text-xs">澳洲</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇨🇦</span>
                                    <span className="text-xs">加拿大</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇺🇸</span>
                                    <span className="text-xs">美國</span>
                                  </div>
                                </th>
                                <th className="text-center p-4 font-bold text-slate-900 dark:text-white min-w-[90px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span>🇬🇧</span>
                                    <span className="text-xs">英國</span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {futuresPropfirmRestrictions.map((firm, index) => (
                                <tr
                                  key={firm.name}
                                  className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                                    index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''
                                  }`}
                                >
                                  <td className="p-4 font-semibold text-slate-900 dark:text-white sticky left-0 bg-inherit z-10">
                                    {firm.name}
                                  </td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.china)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.hongkong)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.taiwan)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.korea)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.japan)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.malaysia)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.singapore)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.thailand)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.australia)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.canada)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.us)}</td>
                                  <td className="p-4 text-center">{renderStatusIcon(firm.uk)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-center">符號說明與備註</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                              <Circle className="text-emerald-500 fill-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-1">○ 開放</div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">完全參與資格，可獲實盤資金。</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800">
                              <XCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <div className="font-bold text-rose-700 dark:text-rose-400 text-sm mb-1">❌ 禁止</div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">完全禁止居住於該地的個人或實體訪問服務。</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                              <Triangle className="text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <div className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-1">△ 模擬</div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">僅具備模擬帳戶資格，合約期間無法轉換為真人實盤。</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            <strong className="text-blue-600 dark:text-blue-400">注意：</strong> 地區限制可能會隨時變動，建議在註冊前先到官網確認最新政策。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawdown Calculation Methods Section */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('drawdown-methods')}
                      className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                          <Calculator size={24} className="text-purple-500" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">不同的回撤計算方式</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">了解各種回撤計算方法及其影響</p>
                        </div>
                      </div>
                      <ChevronDown
                        size={24}
                        className={`text-purple-500 transition-transform duration-300 ${expandedSection === 'drawdown-methods' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expandedSection === 'drawdown-methods' && (
                      <div className="p-6 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-6">
                          {/* Introduction */}
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              回撤（Drawdown）是衡量交易風險的重要指標，不同的 Propfirm 使用不同的計算方式。了解這些差異對於成功通過考核至關重要。
                            </p>
                          </div>

                          {/* Drawdown Types */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* EOD Trailing */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all hover:shadow-lg">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                  <span className="text-lg font-black text-purple-500">EOD</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">EOD Trailing</h4>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                每日結算時更新回撤限制。當淨值在每日收盤時創新高，回撤限制會跟隨調整。
                              </p>

                              {/* Visual Chart */}
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-lg p-4 mb-3 border border-purple-200 dark:border-purple-800">
                                <div className="relative h-24">
                                  {/* Grid lines */}
                                  <div className="absolute inset-0 flex items-end">
                                    <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                                      {/* Background grid */}
                                      <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-600" strokeDasharray="2,2" />

                                      {/* Intraday fluctuations (showing volatility within each day) */}
                                      <path d="M 0 50 Q 12 55, 25 48 T 50 45"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-purple-500" />
                                      <path d="M 50 45 Q 62 40, 75 48 T 100 30"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-purple-500" />
                                      <path d="M 100 30 Q 112 25, 125 32 T 150 28"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-purple-500" />
                                      <path d="M 150 28 Q 162 32, 175 25 T 200 22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-purple-500" />

                                      {/* Drawdown line (trailing with safe distance) */}
                                      <path d="M 0 65 L 50 65 L 50 60 L 100 60 L 100 45 L 150 45 L 150 43 L 200 43"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-rose-400"
                                            strokeDasharray="4,3" />

                                      {/* Day markers at EOD settlement points */}
                                      <circle cx="50" cy="45" r="3" className="fill-purple-500" />
                                      <circle cx="100" cy="30" r="3" className="fill-purple-500" />
                                      <circle cx="150" cy="28" r="3" className="fill-purple-500" />
                                      <circle cx="200" cy="22" r="3" className="fill-purple-500" />
                                    </svg>
                                  </div>
                                  {/* Labels */}
                                  <div className="absolute bottom-0 left-0 text-xs text-purple-600 dark:text-purple-400 font-semibold">Day 1</div>
                                  <div className="absolute bottom-0 right-0 text-xs text-purple-600 dark:text-purple-400 font-semibold">Day 4</div>
                                  {/* Annotation */}
                                  <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-purple-500 dark:text-purple-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded font-medium">日內波動 ≠ 回撤</div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 bg-purple-500 rounded"></div>
                                    <span className="text-slate-600 dark:text-slate-400">日內波動</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 bg-rose-400 rounded" style={{backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 3px, transparent 3px, transparent 6px)'}}></div>
                                    <span className="text-slate-600 dark:text-slate-400">回撤限制</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-3">
                                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mb-2">
                                  <strong>更新時機：</strong>
                                </p>
                                <p className="text-xs font-mono text-purple-600 dark:text-purple-400">
                                  每日收盤時檢查並調整
                                </p>
                              </div>
                              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-3">
                                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">🔒 鎖定機制</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  當盈利達到 Max DD 或 Max DD + $100 時，回撤限制會鎖定，停止 trailing
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 dark:text-slate-400">日內波動不影響，適合新手入門</p>
                              </div>
                            </div>

                            {/* Intraday Trailing */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all hover:shadow-lg">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                  <span className="text-lg font-black text-indigo-500">ID</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Intraday Trailing</h4>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                即時追蹤回撤限制。當淨值創新高時，回撤限制會立即調整，規則最嚴格。
                              </p>

                              {/* Visual Chart */}
                              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-lg p-4 mb-3 border border-indigo-200 dark:border-indigo-800">
                                <div className="relative h-24">
                                  <div className="absolute inset-0 flex items-end">
                                    <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                                      {/* Background grid */}
                                      <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-600" strokeDasharray="2,2" />

                                      {/* Smooth equity line (continuous tracking) */}
                                      <path d="M 0 60 Q 25 55, 50 45 T 100 30 Q 125 28, 150 35 T 200 32"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-indigo-500" />

                                      {/* Smooth drawdown line (continuous trailing) */}
                                      <path d="M 0 70 Q 25 65, 50 55 T 100 40 Q 125 38, 150 40 T 200 40"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-rose-400"
                                            strokeDasharray="4,3" />

                                      {/* Multiple tracking points */}
                                      <circle cx="50" cy="45" r="2" className="fill-indigo-400 opacity-60" />
                                      <circle cx="100" cy="30" r="2" className="fill-indigo-400 opacity-60" />
                                      <circle cx="150" cy="35" r="2" className="fill-indigo-400 opacity-60" />
                                      <circle cx="200" cy="32" r="2" className="fill-indigo-400 opacity-60" />
                                    </svg>
                                  </div>
                                  {/* Labels */}
                                  <div className="absolute bottom-0 left-0 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">09:00</div>
                                  <div className="absolute bottom-0 right-0 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">16:00</div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 bg-indigo-500 rounded"></div>
                                    <span className="text-slate-600 dark:text-slate-400">淨值</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 bg-rose-400 rounded" style={{backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 3px, transparent 3px, transparent 6px)'}}></div>
                                    <span className="text-slate-600 dark:text-slate-400">回撤限制</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-3">
                                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mb-2">
                                  <strong>更新時機：</strong>
                                </p>
                                <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                                  即時更新，每筆交易後
                                </p>
                              </div>
                              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-3">
                                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">🔒 鎖定機制</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  當盈利達到 Max DD 或 Max DD + $100 時，回撤限制會鎖定，停止 trailing
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 dark:text-slate-400">最嚴格規則，需謹慎管理風險</p>
                              </div>
                            </div>

                            {/* Static */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all hover:shadow-lg">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                  <span className="text-lg font-black text-cyan-500">S</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Static Drawdown</h4>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                固定不變的回撤限制。從初始餘額開始計算，不會隨盈利而調整。
                              </p>

                              {/* Visual Chart */}
                              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/10 dark:to-teal-900/10 rounded-lg p-4 mb-3 border border-cyan-200 dark:border-cyan-800">
                                <div className="relative h-24">
                                  <div className="absolute inset-0 flex items-end">
                                    <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                                      {/* Background grid */}
                                      <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-600" strokeDasharray="2,2" />

                                      {/* Equity line (fluctuating) */}
                                      <path d="M 0 60 Q 25 55, 50 45 T 100 30 Q 125 28, 150 35 T 200 25"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-cyan-500" />

                                      {/* Fixed drawdown line (static - horizontal) */}
                                      <line x1="0" y1="70" x2="200" y2="70"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-rose-400"
                                            strokeDasharray="4,3" />

                                      {/* Arrow indicators showing line stays fixed */}
                                      <path d="M 180 70 L 185 67 L 185 73 Z" className="fill-rose-400" />
                                      <path d="M 190 70 L 195 67 L 195 73 Z" className="fill-rose-400" />
                                    </svg>
                                  </div>
                                  {/* Labels */}
                                  <div className="absolute top-0 right-2 text-xs text-rose-500 dark:text-rose-400 font-semibold bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded">固定不變</div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 bg-cyan-500 rounded"></div>
                                    <span className="text-slate-600 dark:text-slate-400">淨值</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 bg-rose-400 rounded" style={{backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 3px, transparent 3px, transparent 6px)'}}></div>
                                    <span className="text-slate-600 dark:text-slate-400">回撤限制</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-3">
                                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mb-2">
                                  <strong>公式：</strong>
                                </p>
                                <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                                  回撤 = 初始餘額 - 當前淨值
                                </p>
                              </div>
                              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 mb-3">
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">✓ 無鎖定機制</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  回撤限制永遠固定，不會因盈利而改變
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 dark:text-slate-400">簡單明瞭，風險空間不變, 在期貨挑戰中非常罕見</p>
                              </div>
                            </div>
                          </div>

                          {/* Warning Box */}
                          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              <strong className="text-purple-600 dark:text-purple-400">重要提示：</strong> 不同 Propfirm 使用不同的回撤計算方式，在開始交易前務必仔細閱讀規則，選擇適合自己交易風格的計算方式。
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coming Soon Message */}
                  <div className="text-center mt-8 p-8 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <Terminal size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">更多 Futures 內容即將推出</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      更多優質內容包括合約規格、交易平台、訂單類型等正在準備中
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
