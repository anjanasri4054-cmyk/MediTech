import React, { useState } from 'react';
import { RxBridgeProvider } from './context/RxBridgeContext';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './pages/HomeScreen';
import { ScanVerifyScreen } from './pages/ScanVerifyScreen';
import { CarePlanScreen } from './pages/CarePlanScreen';
import { CaregiverScreen } from './pages/CaregiverScreen';
import { ToastNotification } from './components/ToastNotification';

type Tab = 'home' | 'scan' | 'plan' | 'caregiver';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');

  const handleNavigate = (tab: Tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={handleNavigate} />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeScreen onNavigate={handleNavigate} />}
        {currentTab === 'scan' && <ScanVerifyScreen onNavigate={handleNavigate} />}
        {currentTab === 'plan' && <CarePlanScreen onNavigate={handleNavigate} />}
        {currentTab === 'caregiver' && <CaregiverScreen onNavigate={handleNavigate} />}
      </main>

      {/* Real-time Toast Notifications */}
      <ToastNotification />

      {/* Minimal App Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p className="font-semibold text-slate-700">
            MediBridge — Living medication record.
          </p>
          <p>© 2026 MediBridge Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <RxBridgeProvider>
      <MainApp />
    </RxBridgeProvider>
  );
}

export default App;
