import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

export default function EconomicCalendar({ theme }) {
  const containerRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "100%",
      "colorTheme": isDark ? "dark" : "light",
      "isTransparent": true,
      "locale": "zh_TW",
      "importanceFilter": "0,1",
      "currencyFilter": "USD,EUR,JPY,GBP,AUD,CAD,CHF,NZD,CNY",
      "utm_source": "www.tradingview.com",
      "utm_medium": "widget_new",
      "utm_campaign": "events"
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const copyrightSpan = document.createElement('div');
    copyrightSpan.className = 'tradingview-widget-copyright';

    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(copyrightSpan);
    containerRef.current.appendChild(script);
  }, [isDark]);

  const buttonClass = `px-3 py-1.5 text-[10px] md:text-xs font-medium rounded-lg transition-all border flex items-center gap-1.5
    ${isDark
      ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 hover:border-slate-500'
      : 'bg-white hover:bg-gray-50 text-slate-600 border-gray-200 hover:border-emerald-500/30'
    }`;

  return (
    <div className="h-full flex flex-col">
      {/* 提示訊息 */}
      <div className={`px-4 py-2.5 text-[11px] text-center border-b font-medium tracking-wide shrink-0
        ${isDark
          ? 'bg-blue-900/20 text-blue-300 border-blue-800/30'
          : 'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
        💡 提示：如需更多日期，請點擊日曆內的「本週」或「下週」
      </div>

      {/* 日曆 Widget - 佔據剩餘空間 */}
      <div ref={containerRef} className="tradingview-widget-container flex-1 w-full overflow-hidden"></div>

      {/* 外部資源連結區 */}
      <div className={`p-3 border-t shrink-0 flex flex-wrap gap-2 justify-center items-center
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-gray-100'}`}>
        <a
          href="https://www.forexfactory.com/calendar"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          <ExternalLink size={12} className="opacity-70" />
          Forex Factory
        </a>
        <a
          href="https://www.myfxbook.com/forex-economic-calendar"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          <ExternalLink size={12} className="opacity-70" />
          Myfxbook
        </a>
        <a
          href="https://www.investing.com/economic-calendar/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          <ExternalLink size={12} className="opacity-70" />
          Investing.com
        </a>
        <a
          href="https://www.jin10.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          <ExternalLink size={12} className="opacity-70" />
          金十數據
        </a>
      </div>
    </div>
  );
}
