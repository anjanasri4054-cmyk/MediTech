import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface SafetyDisclaimerProps {
  compact?: boolean;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>AI Assistance Notice:</strong> AI extraction is for assistance only. Always verify medication instructions with a qualified healthcare professional.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border border-amber-200 rounded-2xl shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="text-xs md:text-sm text-amber-950 space-y-1">
          <div className="font-semibold text-amber-900 flex items-center gap-1.5">
            <span>Healthcare Safety & Non-Diagnostic Compliance Notice</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            MedBridge AI helps organize and explain doctor prescription information. It does not diagnose conditions, prescribe medicines, alter dosages, or replace advice from a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};
