import React from 'react';

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

export default RadarChart;
