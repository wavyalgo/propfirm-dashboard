import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Monitor, CreditCard, BarChart2, Terminal, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navigation({ theme, toggleTheme, isMenuOpen, setIsMenuOpen }) {
  return (
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

          {/* 折扣中心 */}
          <a href="#discounts" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
            折扣中心
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </a>

          {/* Propfirm測評 */}
          <a href="#firms" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
            Propfirm測評
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </a>

          {/* 交易工具 */}
          <a href="#tools" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
            交易工具
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </a>

          {/* 交易策略專區 */}
          <Link to="/strategy" className="hover:text-slate-900 dark:hover:text-white transition-colors relative group py-2">
            交易策略專區
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </Link>
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
            Propfirm現金流組合
          </Link>
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
          <a href="#discounts" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium" onClick={() => setIsMenuOpen(false)}>折扣中心</a>
          <a href="#firms" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">Propfirm測評</a>

          <a href="#tools" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium" onClick={() => setIsMenuOpen(false)}>交易工具</a>
          <Link to="/strategy" className="block py-2 px-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium" onClick={() => setIsMenuOpen(false)}>交易策略專區</Link>

          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

          <Link to="/dashboard" className="block py-2 px-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium">Propfirm現金流組合</Link>
        </div>
      )}
    </nav>
  );
}
