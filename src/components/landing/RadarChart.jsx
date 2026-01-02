import React, { useMemo } from 'react';

// 常量定義 - 移到組件外部避免重複創建
const LABELS = ['價格', '規則', '出金', '平台', '客服'];
const CENTER = 60;
const MAX_RADIUS = 35;
const GRID_LEVELS = [20, 40, 60, 80, 100];

const COLOR_MAP = {
  blue: { fill: 'rgba(59, 130, 246, 0.2)', stroke: 'rgb(59, 130, 246)', grid: 'rgba(148, 163, 184, 0.15)' },
  emerald: { fill: 'rgba(16, 185, 129, 0.2)', stroke: 'rgb(16, 185, 129)', grid: 'rgba(148, 163, 184, 0.15)' },
  purple: { fill: 'rgba(168, 85, 247, 0.2)', stroke: 'rgb(168, 85, 247)', grid: 'rgba(148, 163, 184, 0.15)' }
};

// 五邊形雷達圖組件
const RadarChart = React.memo(({ stats, color }) => {
  const values = useMemo(() => [
    stats.price,
    stats.rules,
    stats.withdrawal,
    stats.platform,
    stats.support
  ], [stats.price, stats.rules, stats.withdrawal, stats.platform, stats.support]);

  const colors = useMemo(() => COLOR_MAP[color] || COLOR_MAP.blue, [color]);

  // 計算點座標的函數
  const getPoint = useMemo(() => {
    return (value, index) => {
      const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
      const radius = (value / 100) * MAX_RADIUS;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle);
      return `${x},${y}`;
    };
  }, []);

  const getGridPoint = useMemo(() => {
    return (percentage, index) => {
      const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
      const radius = (percentage / 100) * MAX_RADIUS;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle);
      return `${x},${y}`;
    };
  }, []);

  // 生成五邊形路徑
  const dataPath = useMemo(() =>
    values.map((value, index) => getPoint(value, index)).join(' '),
    [values, getPoint]
  );

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-36 h-36">
        {/* 背景網格 */}
        {GRID_LEVELS.map((level, levelIndex) => (
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
              x1={CENTER}
              y1={CENTER}
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
        {LABELS.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
          const labelRadius = 52;
          const x = CENTER + labelRadius * Math.cos(angle);
          const y = CENTER + labelRadius * Math.sin(angle);

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
});

RadarChart.displayName = 'RadarChart';

export default RadarChart;
