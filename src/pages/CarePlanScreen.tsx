import React from 'react';
import {
  CheckCircle2,
  Clock,
  Volume2,
  Share2,
  Accessibility,
  Check,
  Languages,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRxBridge } from '../context/RxBridgeContext';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { SafetyNotice } from '../components/SafetyNotice';
import { VoiceAlertModal } from '../components/VoiceAlertModal';


export const CarePlanScreen: React.FC<{ onNavigate: (tab: 'home' | 'scan' | 'plan' | 'caregiver') => void }> = ({
  onNavigate,
}) => {
  const {
    patient,
    caregiver,
    doses,
    markDoseTaken,
    shareCarePlan,
    language,
    setLanguage,
    seniorMode,
    toggleSeniorMode,
    speak,
    stopVoice,
    isVoicePlaying,
    reminderFlow,
  } = useRxBridge();


  const handleListenAll = () => {
    if (isVoicePlaying) {
      stopVoice();
    } else {
      const speechText =
        language === 'te'
          ? 'ఈ రోజు ఉదయం ఆమ్లోడిపైన్ 5 ఎంజి మరియు మెట్ఫార్మిన్ 500 ఎంజి మాత్రలు పూర్తయ్యాయి. రాత్రి భోజనం తర్వాత మెట్ఫార్మిన్ 500 ఎంజి మాత్ర తీసుకోవాలి.'
          : 'Today, morning Amlodipine 5mg and Metformin 500mg are confirmed. Tonight after dinner, Metformin 500mg is scheduled.';
      speak(speechText, language);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 ${seniorMode ? 'text-lg' : ''}`}>

      {/* Voice Alert Modal — appears when caregiver sends a voice reminder */}
      <VoiceAlertModal />

      {/* Medication Completed Banner */}
      <AnimatePresence>
        {reminderFlow.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-3 shadow-md"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-lg">
              🎉
            </div>
            <div>
              <p className="font-extrabold text-sm">Medication Confirmed!</p>
              <p className="text-xs text-emerald-100">
                Anjali (Caregiver) has been notified that Metformin 500 mg was taken.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              {language === 'te' ? 'రోగి కేర్ ప్లాన్' : 'Patient Care Plan'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Patient: <strong>{patient.name}</strong> ({patient.age} yrs)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'te' ? 'మందుల సంరక్షణ ప్రణాళిక' : 'Medication Care Plan'}
          </h1>
        </div>

        {/* Controls: Senior Mode & Language */}
        <div className="flex items-center gap-2">
          {/* Senior Mode Toggle */}
          <button
            onClick={toggleSeniorMode}
            title="Senior Mode: Larger Text and Buttons"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              seniorMode
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Accessibility className="w-4 h-4 text-amber-700" />
            <span>{seniorMode ? 'Senior Mode ON' : 'Senior Mode'}</span>
          </button>

          {/* Language Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2.5 py-1 rounded-md font-telugu transition-all ${
                language === 'te' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Voice Readout Banner */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900">
            {language === 'te' ? 'వాయిస్ ద్వారా రోజూవారీ ప్లాన్ వినండి' : 'Listen to Today’s Care Schedule'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'te' ? 'క్లియర్ తెలుగు ఆడియో వివరణ' : 'Clear spoken audio instructions'}
          </p>
        </div>

        <VoiceWaveform
          isSpeaking={isVoicePlaying}
          onToggle={handleListenAll}
          language={language}
        />
      </div>

      {/* Today's Structured Medication Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
            {language === 'te' ? 'ఈ రోజు షెడ్యూల్ (Today)' : "Today's Timeline"}
          </h2>
          <span className="text-xs text-slate-400 font-mono">21 Sep 2026</span>
        </div>

        <div className="space-y-3">
          {doses.map((dose) => {
            const isConfirmed = dose.status === 'confirmed';
            const isConfirming = dose.status === 'confirming';

            return (
              <div
                key={dose.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isConfirmed
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Timing & Medicine */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {dose.scheduledTime}
                      </span>
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        {dose.period === 'Morning' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                        <span>{dose.period}</span>
                      </span>
                    </div>

                    <h3 className={`font-extrabold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                      {dose.medicineName}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600">
                      {dose.instruction}
                    </p>

                    {language === 'te' && (
                      <p className="text-xs sm:text-sm font-telugu text-teal-800 font-medium">
                        {dose.instructionTe}
                      </p>
                    )}
                  </div>

                  {/* Right: Confirmation Action / Status */}
                  <div className="shrink-0">
                    {isConfirmed ? (
                      <div className="text-left sm:text-right">
                        <span className={`inline-flex items-center gap-1.5 font-bold rounded-xl bg-emerald-100 text-emerald-800 ${seniorMode ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'}`}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>✓ Confirmed</span>
                        </span>
                        {dose.confirmedAt && (
                          <span className="block text-[11px] text-slate-400 mt-1">
                            Taken at {dose.confirmedAt}
                          </span>
                        )}
                      </div>
                    ) : isConfirming ? (
                      <button
                        disabled
                        className={`font-bold bg-amber-500 text-white rounded-xl flex items-center gap-2 animate-pulse ${seniorMode ? 'px-6 py-3 text-base' : 'px-4 py-2 text-xs'}`}
                      >
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Confirming...</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => markDoseTaken(dose.id)}
                        className={`bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                          seniorMode ? 'w-full sm:w-auto px-6 py-3.5 text-base' : 'px-4 py-2.5 text-xs sm:text-sm'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Mark as taken</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAREGIVER CONNECTION BOX */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900">Connected Caregiver</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            ● Connected
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-base text-slate-900">{caregiver.name}</div>
            <div className="text-xs text-slate-500">{caregiver.relationship} • Remote Monitor</div>
            {caregiver.lastShared && (
              <div className="text-[11px] text-teal-700 mt-0.5">
                Care plan shared with Anjali.
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shareCarePlan}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Share Care Plan</span>
            </button>

            <button
              onClick={() => onNavigate('caregiver')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Caregiver View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <SafetyNotice />

    </div>
  );
};
