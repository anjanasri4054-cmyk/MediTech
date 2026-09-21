import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const SafetyNotice: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 space-y-1">
      <div className="font-bold text-slate-800 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-teal-700" />
        <span>Safety & Non-Diagnostic Compliance Notice</span>
      </div>
      <p className="leading-relaxed">
        RXBRIDGE helps organize and explain prescription information. It does not diagnose conditions, prescribe medication, change dosage, or replace advice from a qualified healthcare professional.
      </p>
    </div>
  );
};
