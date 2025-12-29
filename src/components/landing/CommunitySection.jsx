import React from 'react';
import { MessageCircle, Check } from 'lucide-react';

export default function CommunitySection() {
  return (
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
  );
}
