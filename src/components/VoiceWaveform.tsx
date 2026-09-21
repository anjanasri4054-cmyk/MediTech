import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceWaveformProps {
  isSpeaking: boolean;
  onToggle: () => void;
  language: 'en' | 'te';
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isSpeaking,
  onToggle,
  language,
}) => {
  const bars = [40, 75, 55, 90, 100, 60, 85, 45, 70, 50];

  return (
    <div className="inline-flex items-center gap-2 p-1.5 px-3 bg-slate-100/90 border border-slate-200 rounded-xl">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          isSpeaking
            ? 'bg-amber-600 text-white animate-pulse'
            : 'bg-slate-900 hover:bg-slate-800 text-white'
        }`}
      >
        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        <span>{isSpeaking ? (language === 'te' ? 'ఆపండి' : 'Stop') : (language === 'te' ? 'వినండి' : 'Listen')}</span>
      </button>

      {/* Acoustic wave indicator */}
      <div className="flex items-center gap-0.5 h-4 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full transition-all duration-200 ${
              isSpeaking ? 'bg-teal-600 animate-pulse' : 'bg-slate-300'
            }`}
            style={{
              height: isSpeaking ? `${Math.max(25, h * (0.4 + Math.random() * 0.6))}%` : '25%',
            }}
          />
        ))}
      </div>
    </div>
  );
};
