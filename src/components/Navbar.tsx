import React from 'react';
import { Activity, Languages, RotateCcw } from 'lucide-react';
import { useRxBridge } from '../context/RxBridgeContext';

interface NavbarProps {
  currentTab: 'home' | 'scan' | 'plan' | 'caregiver';
  setCurrentTab: (tab: 'home' | 'scan' | 'plan' | 'caregiver') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { language, setLanguage, resetAll } = useRxBridge();

  const navItems: { id: 'home' | 'scan' | 'plan' | 'caregiver'; label: string; labelTe: string }[] = [
    { id: 'home', label: 'Home', labelTe: 'హోమ్' },
    { id: 'scan', label: 'Scan & Verify', labelTe: 'స్కాన్ & వెరిఫై' },
    { id: 'plan', label: 'Care Plan', labelTe: 'కేర్ ప్లాన్' },
    { id: 'caregiver', label: 'Caregiver View', labelTe: 'కేర్‌గివర్ వీక్షణ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
              MediBridge
            </span>
            <span className="text-[11px] text-teal-700 font-medium hidden sm:block">
              Living medication record
            </span>
          </div>
        </button>

        {/* Minimal Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {language === 'te' ? item.labelTe : item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Language & Reset */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-1 rounded-md font-telugu transition-all ${
                language === 'te'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              తెలుగు
            </button>
          </div>

          <button
            onClick={resetAll}
            title="Reset Demo Data"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
