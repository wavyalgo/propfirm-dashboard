import { Target, TrendingUp, Code } from 'lucide-react';

// 團隊成員數據
export const teamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    role: "首席交易策略師",
    icon: Target,
    experience: "5年+ Prop Firm 實戰",
    specialties: ["策略開發", "風險管理", "算法交易"],
    achievements: [
      "經手超過 20 個 Prop Firm 帳戶",
      "成功出金累計 $150K+",
      "專精於期貨市場 NQ/ES 交易"
    ],
    color: "emerald"
  },
  {
    id: 2,
    name: "Sarah Wang",
    role: "CFD 專家顧問",
    icon: TrendingUp,
    experience: "4年+ CFD 交易經驗",
    specialties: ["外匯交易", "黃金分析", "MT4/MT5 優化"],
    achievements: [
      "破解多家 CFD 資助商隱藏規則",
      "FTMO & Funding Pips 雙認證交易員",
      "擅長波段交易與資金管理"
    ],
    color: "blue"
  },
  {
    id: 3,
    name: "Kevin Liu",
    role: "技術架構師",
    icon: Code,
    experience: "6年+ 金融科技開發",
    specialties: ["EA 開發", "API 整合", "數據分析"],
    achievements: [
      "開發多款 EA 輔助工具",
      "精通 Rithmic/TradingView 連接",
      "協助團隊自動化交易流程"
    ],
    color: "purple"
  }
];
