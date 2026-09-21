import React from 'react';
import { ArrowRight, ScanLine, ShieldCheck, CheckCircle2, Sparkles, UserCheck, HeartHandshake } from 'lucide-react';
import { useRxBridge } from '../context/RxBridgeContext';
import { SafetyNotice } from '../components/SafetyNotice';

export const HomeScreen: React.FC<{ onNavigate: (tab: 'home' | 'scan' | 'plan' | 'caregiver') => void }> = ({
  onNavigate,
}) => {
  const { loadDemoPrescription, language } = useRxBridge();

  const handleTryDemo = () => {
    loadDemoPrescription();
    onNavigate('scan');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      
      {/* 1. HERO SECTION */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>AI Verification & Caregiver Coordination</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Understand the prescription. <br />
          <span className="text-teal-700">Connect the care.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          RXBRIDGE turns prescription information into a clear, multilingual medication plan and helps caregivers stay informed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('scan')}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <ScanLine className="w-4 h-4 text-teal-400" />
            <span>Scan Prescription</span>
          </button>

          <button
            onClick={handleTryDemo}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            Try Demo
          </button>
        </div>
      </div>

      {/* 2. CENTRAL PRODUCT PIPELINE VISUAL */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            The RXBRIDGE Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Step 01</span>
            <h3 className="font-bold text-sm text-slate-900">Doctor Rx Slip</h3>
            <p className="text-[11px] text-slate-500">Scan handwritten or printed prescription</p>
          </div>

          <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 space-y-1">
            <span className="text-[10px] font-bold text-teal-700 uppercase">Step 02</span>
            <h3 className="font-bold text-sm text-slate-900">AI Verification Gate</h3>
            <p className="text-[11px] text-teal-900 font-medium">Confirms uncertain dosage with user</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Step 03</span>
            <h3 className="font-bold text-sm text-slate-900">Telugu & English</h3>
            <p className="text-[11px] text-slate-500">Simple language and audio voice</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Step 04</span>
            <h3 className="font-bold text-sm text-slate-900">Caregiver Link</h3>
            <p className="text-[11px] text-slate-500">Real-time dose acknowledgement</p>
          </div>

        </div>
      </div>

      {/* 3. 3-STEP EXPLANATION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="text-3xl font-extrabold text-slate-300 font-mono">01</div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">SCAN</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Capture the prescription. Our AI reads medical abbreviations, dosages, and clinical timings.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-teal-300 ring-2 ring-teal-50 space-y-2">
          <div className="text-3xl font-extrabold text-teal-600 font-mono">02</div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">VERIFY</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Review information the AI is uncertain about. Safety-first verification gate prevents errors.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="text-3xl font-extrabold text-slate-300 font-mono">03</div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">CARE</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Create a shared medication plan for the patient and caregiver with live synchronization.
          </p>
        </div>

      </div>

      {/* Safety compliance notice */}
      <SafetyNotice />

    </div>
  );
};
