import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Knowledge from './pages/Knowledge';
import Platform from './pages/Platform';
import Withdrawal from './pages/Withdrawal';
import Discounts from './pages/Discounts';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/propfirm-dashboard">
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/discounts" element={<Discounts />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
