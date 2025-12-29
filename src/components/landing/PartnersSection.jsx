import React from 'react';
import { partners } from '../../data/partners';

export default function PartnersSection() {
  return (
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
  );
}
