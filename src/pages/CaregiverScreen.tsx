import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Mic,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Pill,
  HeartHandshake,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRxBridge } from '../context/RxBridgeContext';
import { SafetyNotice } from '../components/SafetyNotice';
import type { ReminderStatus } from '../context/RxBridgeContext';

// ── Caregiver-side status pipeline ──────────────────────────────────────────

const STEPS: { status: ReminderStatus; label: string; icon: React.ReactNode; color: string }[] = [
  {
    status: 'sent',
    label: 'Reminder Sent',
    icon: <PhoneCall className="w-4 h-4" />,
    color: 'bg-sky-500',
  },
  {
    status: 'heard',
    label: 'Lakshmi Heard It',
    icon: <Bell className="w-4 h-4" />,
    color: 'bg-violet-500',
  },
  {
    status: 'hasMedicine',
    label: 'Has the Medicine',
    icon: <Pill className="w-4 h-4" />,
    color: 'bg-amber-500',
  },
  {
    status: 'completed',
    label: 'Medication Taken',
    icon: <HeartHandshake className="w-4 h-4" />,
    color: 'bg-emerald-500',
  },
];

const STATUS_ORDER: ReminderStatus[] = ['idle', 'sent', 'heard', 'hasMedicine', 'completed'];

function stepIndex(status: ReminderStatus) {
  return STATUS_ORDER.indexOf(status);
}

// ────────────────────────────────────────────────────────────────────────────

export const CaregiverScreen: React.FC<{ onNavigate: (tab: 'home' | 'scan' | 'plan' | 'caregiver') => void }> = ({
  onNavigate,
}) => {
  const {
    patient,
    caregiver,
    doses,
    language,
    reminderFlow,
    sendVoiceReminder,
  } = useRxBridge();

  const isNightPending = doses.some((d) => d.period === 'Night' && d.status === 'pending');
  const confirmedCount = doses.filter((d) => d.status === 'confirmed').length;
  const currentIdx = stepIndex(reminderFlow.status);
  const isFlowActive = reminderFlow.status !== 'idle';
  const isCompleted = reminderFlow.status === 'completed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              Caregiver View
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {caregiver.name} ({caregiver.relationship})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Today's Medication Status
          </h1>
        </div>

        <button
          onClick={() => onNavigate('plan')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Patient View</span>
        </button>
      </div>

      {/* Patient Summary */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-extrabold text-base">
              LD
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">{patient.name}</h2>
              <p className="text-xs text-slate-500">Age: {patient.age} • Telugu Preferred</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Status</span>
            <span className="text-sm font-extrabold text-slate-900">
              {confirmedCount} of {doses.length} Doses Confirmed
            </span>
          </div>
        </div>

        {isNightPending && reminderFlow.status === 'idle' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>
              <strong>Caregiver Notice:</strong> Tonight's Metformin (8:00 PM) is pending acknowledgement.
            </span>
            <span className="text-[11px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Awaiting dose
            </span>
          </div>
        )}
      </div>

      {/* ── VOICE REMINDER PANEL ─────────────────────────────────────────── */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${isCompleted ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'} shadow-sm`}>

        {/* Panel Header */}
        <div className={`px-5 py-4 flex items-center justify-between border-b ${isCompleted ? 'border-emerald-200 bg-emerald-100/60' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <Mic className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-teal-600'}`} />
            <span className="font-extrabold text-sm text-slate-900">Voice Reminder</span>
            {isFlowActive && !isCompleted && (
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping inline-block" />
            )}
          </div>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              ✓ Medication completed
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-5">

          {/* Message Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reminder Message</p>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              🎙️ "{reminderFlow.message}"
            </p>
            {language === 'te' && (
              <p className="text-sm font-telugu text-teal-700 font-medium leading-relaxed">
                {reminderFlow.messageTeluguText}
              </p>
            )}
          </div>

          {/* Send Button (only when idle) */}
          {!isFlowActive && (
            <button
              onClick={sendVoiceReminder}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>🎙️ Send Voice Reminder to Lakshmi</span>
            </button>
          )}

          {/* Live Status Pipeline */}
          <AnimatePresence>
            {isFlowActive && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Live Patient Response
                </p>

                <div className="space-y-2">
                  {STEPS.map((step, idx) => {
                    const done = currentIdx > idx + 1; // idx+1 because 'sent'=idx1
                    const active = currentIdx === idx + 1;

                    return (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          done
                            ? 'bg-emerald-50 border-emerald-200'
                            : active
                            ? 'bg-white border-sky-300 shadow-sm ring-1 ring-sky-100'
                            : 'bg-slate-50 border-slate-200 opacity-40'
                        }`}
                      >
                        {/* Icon bubble */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                            done ? 'bg-emerald-500' : active ? step.color : 'bg-slate-300'
                          } ${active ? 'animate-pulse' : ''}`}
                        >
                          {done ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-xs font-bold ${
                            done ? 'text-emerald-700' : active ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>

                        {/* Right indicator */}
                        <div className="ml-auto">
                          {done && (
                            <span className="text-[10px] font-bold text-emerald-600">✓ Done</span>
                          )}
                          {active && (
                            <span className="text-[10px] font-bold text-sky-600 animate-pulse">
                              ● Live
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Completed celebration */}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-600 text-white rounded-xl text-center space-y-1"
                  >
                    <p className="text-xl">🎉</p>
                    <p className="font-extrabold text-sm">Medication Confirmed!</p>
                    <p className="text-xs text-emerald-100">
                      Lakshmi has taken her Metformin 500 mg after dinner.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Medication Status Timeline (read-only) */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900">Medication Stream</h3>

        <div className="space-y-3">
          {doses.map((dose) => {
            const isConfirmed = dose.status === 'confirmed';

            return (
              <div
                key={dose.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isConfirmed
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {dose.scheduledTime}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        • {dose.period}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">{dose.medicineName}</h4>
                    <p className="text-xs text-slate-500">{dose.instruction}</p>
                  </div>

                  <div className="text-right">
                    {isConfirmed ? (
                      <div>
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ Confirmed</span>
                        </span>
                        {dose.confirmedAt && (
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Acknowledged at {dose.confirmedAt}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold inline-flex items-center gap-1 border border-amber-200 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>● Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time sync hint */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-1">
        <div className="font-bold text-teal-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Cross-Tab Real-Time Sync</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Open this app in a <strong>second tab</strong>, go to <strong>Care Plan</strong> and you'll see the voice alert arrive. As Lakshmi clicks through the 3 confirmation steps, this screen updates live via BroadcastChannel.
        </p>
      </div>

      <SafetyNotice />
    </div>
  );
};
