import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';

// 使用 React.lazy 實現路由級代碼分割
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Knowledge = lazy(() => import('./pages/Knowledge'));
const Platform = lazy(() => import('./pages/Platform'));
const Withdrawal = lazy(() => import('./pages/Withdrawal'));
const Discounts = lazy(() => import('./pages/Discounts'));
const TradingStrategy = lazy(() => import('./pages/TradingStrategy'));

// 加載中組件
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#050911] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400 font-medium">載入中...</p>
    </div>
  </div>
);

function App() {
  // 開發環境使用 '/'，生產環境使用 '/propfirm-dashboard'
  const basename = import.meta.env.DEV ? '/' : '/propfirm-dashboard';

  return (
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Toaster position="top-right" richColors />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/strategy" element={<TradingStrategy />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
