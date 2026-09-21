import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Pill, CheckCircle2, X } from 'lucide-react';
import { useRxBridge } from '../context/RxBridgeContext';
import { speechEngine } from '../utils/speech';

// ── Patient-side Voice Alert Modal ──────────────────────────────────────────
// Shows when caregiver sends a VOICE_REMINDER.
// Patient steps through: I HEARD IT → YES, I HAVE THE MEDICINE → TAKEN
// Each step broadcasts back to caregiver via BroadcastChannel.
// ─────────────────────────────────────────────────────────────────────────────

export const VoiceAlertModal: React.FC = () => {
  const { reminderFlow, language, patientAckHeard, patientAckHasMedicine, patientAckTaken, dismissReminder } =
    useRxBridge();

  const { status, message, messageTeluguText, medicine } = reminderFlow;
  const visible = status === 'sent' || status === 'heard' || status === 'hasMedicine';

  // Auto-play the voice when reminder first arrives
  useEffect(() => {
    if (status === 'sent') {
      const txt = language === 'te' ? messageTeluguText : message;
      const lang = language === 'te' ? 'te' : 'en';
      // Small delay so modal animation runs first
      const t = setTimeout(() => speechEngine.speak(txt, lang), 600);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="voice-alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.88, y: 32 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.88, y: 32 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top accent */}
            <div className="bg-gradient-to-r from-teal-600 to-sky-600 px-6 pt-6 pb-5 text-white relative">
              <button
                onClick={dismissReminder}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Pulsing bell */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                </div>
              </div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 text-center mb-1">
                🔔 Voice Alert from Anjali
              </p>
              <h2 className="text-lg font-extrabold text-center leading-snug">
                Time for your medicine
              </h2>
            </div>

            {/* Message Body */}
            <div className="px-6 py-5 space-y-5">

              {/* Message text */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-200">
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  🎙️ "{message}"
                </p>
                {language === 'te' && (
                  <p className="text-sm font-telugu text-teal-700 font-medium leading-relaxed">
                    {messageTeluguText}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-bold text-teal-700">{medicine}</span>
                </div>
              </div>

              {/* Progressive step buttons */}
              <div className="space-y-2.5">

                {/* Step 1: I HEARD IT */}
                {status === 'sent' && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={patientAckHeard}
                    className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base rounded-2xl shadow-md transition-transform active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Bell className="w-5 h-5" />
                    <span>I HEARD IT</span>
                  </motion.button>
                )}

                {/* Step 2: YES, I HAVE THE MEDICINE */}
                {status === 'heard' && (
                  <>
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Heard ✓ — Now confirm you have the medicine</span>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={patientAckHasMedicine}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base rounded-2xl shadow-md transition-transform active:scale-[0.97] flex items-center justify-center gap-2"
                    >
                      <Pill className="w-5 h-5" />
                      <span>YES, I HAVE THE MEDICINE</span>
                    </motion.button>
                  </>
                )}

                {/* Step 3: TAKEN */}
                {status === 'hasMedicine' && (
                  <>
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Medicine ready ✓ — Confirm you've taken it</span>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={patientAckTaken}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl rounded-2xl shadow-md transition-transform active:scale-[0.97] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      <span>TAKEN</span>
                    </motion.button>
                  </>
                )}

              </div>

              {/* Progress indicators */}
              <div className="flex items-center justify-center gap-2">
                {['sent', 'heard', 'hasMedicine'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${
                      status === s
                        ? 'w-6 bg-teal-600'
                        : STATUS_ORDER.indexOf(status as string) > STATUS_ORDER.indexOf(s)
                        ? 'w-6 bg-emerald-500'
                        : 'w-3 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper: partial order for progress dots
const STATUS_ORDER = ['sent', 'heard', 'hasMedicine', 'completed'];
