import React from 'react';
import { ShieldCheck, Users, Award } from 'lucide-react';
import { teamMembers } from '../../data/teamMembers';

export default function AboutUsSection() {
  return (
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
  );
}
