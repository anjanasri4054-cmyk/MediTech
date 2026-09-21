import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language, MedicineItem, MedicationDose, CaregiverInfo, PatientInfo, PrescriptionDoc } from '../types';
import { syncBus } from '../utils/syncChannel';
import { speechEngine } from '../utils/speech';
import confetti from 'canvas-confetti';

export type ReminderStatus = 'idle' | 'sent' | 'heard' | 'hasMedicine' | 'completed';

export interface ReminderFlow {
  status: ReminderStatus;
  medicine: string;
  message: string;
  messageTeluguText: string;
}

const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    timing: 'Morning & Night (After food)',
    instruction: 'Take 500 mg twice daily after breakfast and after dinner.',
    instructionTe: 'రోజుకు రెండు సార్లు ఉదయం మరియు రాత్రి భోజనం తర్వాత 500 mg తీసుకోండి.',
    isVerified: false, // Verification Gate demonstration
    uncertainFields: ['dosage'],
    verificationQuestion: 'Did we read 500 mg dosage correctly from handwriting?',
  },
  {
    id: 'med-2',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'Once daily',
    timing: 'Morning (After breakfast)',
    instruction: 'Take 5 mg once daily every morning after breakfast.',
    instructionTe: 'ప్రతిరోజూ ఉదయం అల్పాహారం తర్వాత 5 mg తీసుకోండి.',
    isVerified: true,
    uncertainFields: [],
  },
];

const INITIAL_DOSES: MedicationDose[] = [
  {
    id: 'dose-1',
    medicineId: 'med-2',
    medicineName: 'Amlodipine 5 mg',
    dosage: '5 mg',
    scheduledTime: '08:00 AM',
    period: 'Morning',
    instruction: 'Morning after breakfast',
    instructionTe: 'ఉదయం అల్పాహారం తర్వాత',
    status: 'confirmed',
    confirmedAt: '08:15 AM',
  },
  {
    id: 'dose-2',
    medicineId: 'med-1',
    medicineName: 'Metformin 500 mg',
    dosage: '500 mg',
    scheduledTime: '08:00 AM',
    period: 'Morning',
    instruction: 'Morning after breakfast',
    instructionTe: 'ఉదయం అల్పాహారం తర్వాత',
    status: 'confirmed',
    confirmedAt: '08:15 AM',
  },
  {
    id: 'dose-3',
    medicineId: 'med-1',
    medicineName: 'Metformin 500 mg',
    dosage: '500 mg',
    scheduledTime: '08:00 PM',
    period: 'Night',
    instruction: 'Night after dinner',
    instructionTe: 'రాత్రి భోజనం తర్వాత',
    status: 'pending',
  },
];

const INITIAL_PATIENT: PatientInfo = {
  name: 'Lakshmi Devi',
  age: 68,
  gender: 'Female',
  preferredLanguage: 'te',
};

const INITIAL_CAREGIVER: CaregiverInfo = {
  name: 'Anjali',
  relationship: 'Daughter',
  connected: true,
};

const INITIAL_PRESCRIPTION: PrescriptionDoc = {
  doctorName: 'Dr. K. Srinivas Rao, MD',
  clinicName: 'Apollo Care Centre & Diagnostics',
  date: '21 Sep 2026',
  patientName: 'Lakshmi Devi',
  patientAge: 68,
  medicines: INITIAL_MEDICINES,
};

interface RxBridgeContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  seniorMode: boolean;
  toggleSeniorMode: () => void;
  
  patient: PatientInfo;
  caregiver: CaregiverInfo;
  prescription: PrescriptionDoc;
  
  isScanning: boolean;
  scanStage: number;
  prescriptionLoaded: boolean;
  medicines: MedicineItem[];
  allVerified: boolean;
  carePlanCreated: boolean;
  doses: MedicationDose[];
  
  startScan: (onFinish?: () => void) => void;
  loadDemoPrescription: () => void;
  verifyMedicine: (id: string) => void;
  updateMedicine: (id: string, updated: Partial<MedicineItem>) => void;
  createCarePlan: () => void;
  markDoseTaken: (doseId: string) => void;
  shareCarePlan: () => void;
  sendReminder: () => void;
  resetAll: () => void;

  // Voice Confirmation Flow
  reminderFlow: ReminderFlow;
  sendVoiceReminder: () => void;
  patientAckHeard: () => void;
  patientAckHasMedicine: () => void;
  patientAckTaken: () => void;
  dismissReminder: () => void;
  
  isVoicePlaying: boolean;
  speak: (text: string, lang?: Language) => void;
  stopVoice: () => void;
  
  toast: { message: string; type: 'success' | 'info' | 'alert' } | null;
  clearToast: () => void;
}

const RxBridgeContext = createContext<RxBridgeContextType | undefined>(undefined);

export const RxBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [seniorMode, setSeniorMode] = useState(false);
  const [patient] = useState<PatientInfo>(INITIAL_PATIENT);
  const [caregiver, setCaregiver] = useState<CaregiverInfo>(INITIAL_CAREGIVER);
  const [prescription] = useState<PrescriptionDoc>(INITIAL_PRESCRIPTION);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [prescriptionLoaded, setPrescriptionLoaded] = useState(true);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [carePlanCreated, setCarePlanCreated] = useState(true);
  const [doses, setDoses] = useState<MedicationDose[]>(INITIAL_DOSES);
  
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'alert' } | null>(null);

  const INITIAL_REMINDER: ReminderFlow = {
    status: 'idle',
    medicine: 'Metformin 500 mg',
    message: "Lakshmi, it's time for your night medicine. Please take your Metformin after dinner.",
    messageTeluguText: 'లక్ష్మీ, రాత్రి భోజనం తర్వాత మీ మెట్ఫార్మిన్ మాత్ర తీసుకోవాలి.',
  };
  const [reminderFlow, setReminderFlow] = useState<ReminderFlow>(INITIAL_REMINDER);

  // Computed: whether all extracted medicines have been verified by user
  const allVerified = medicines.every((m) => m.isVerified);

  // Subscribe to voice synthesis
  useEffect(() => {
    const unsub = speechEngine.subscribe((speaking) => {
      setIsVoicePlaying(speaking);
    });
    return () => unsub();
  }, []);

  // Listen to Cross-tab & Real-Time Sync Bus
  useEffect(() => {
    const unsubscribe = syncBus.subscribe((event) => {
      if (event.type === 'DOSE_CONFIRMED') {
        const { doseId, confirmedAt } = event.payload;
        setDoses((prev) =>
          prev.map((d) =>
            d.id === doseId ? { ...d, status: 'confirmed', confirmedAt } : d
          )
        );
        showToast('Caregiver view updated: Dose confirmed in real time.', 'success');
      } else if (event.type === 'REMINDER_SENT') {
        showToast('Reminder received from Anjali (Caregiver).', 'alert');
      } else if (event.type === 'PLAN_SHARED') {
        showToast('Care plan shared with Anjali.', 'info');
      } else if (event.type === 'RESET') {
        resetLocalState();
      } else if (event.type === 'VOICE_REMINDER') {
        // Patient side receives voice reminder — show alert modal
        const { message, messageTeluguText, medicine } = event.payload;
        setReminderFlow((prev) => ({
          ...prev,
          status: 'sent',
          message,
          messageTeluguText,
          medicine,
        }));
      } else if (event.type === 'PATIENT_HEARD') {
        setReminderFlow((prev) => ({ ...prev, status: 'heard' }));
        showToast('Lakshmi heard the reminder.', 'info');
      } else if (event.type === 'PATIENT_HAS_MEDICINE') {
        setReminderFlow((prev) => ({ ...prev, status: 'hasMedicine' }));
        showToast('Lakshmi has the medicine ready.', 'info');
      } else if (event.type === 'PATIENT_TAKEN') {
        setReminderFlow((prev) => ({ ...prev, status: 'completed' }));
        showToast('✓ Medication completed!', 'success');
        // Also mark the night dose confirmed
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setDoses((prev) =>
          prev.map((d) =>
            d.id === 'dose-3' ? { ...d, status: 'confirmed', confirmedAt: timeNow } : d
          )
        );
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.5 },
            colors: ['#0d9488', '#0ea5e9', '#10b981', '#f59e0b'],
          });
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'alert') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const clearToast = () => setToast(null);

  const toggleSeniorMode = () => {
    setSeniorMode((prev) => !prev);
  };

  const speak = (text: string, langOverride?: Language) => {
    const l = langOverride || language;
    speechEngine.speak(text, l);
  };

  const stopVoice = () => {
    speechEngine.stop();
  };

  const startScan = (onFinish?: () => void) => {
    setIsScanning(true);
    setScanStage(1);
    setPrescriptionLoaded(true);

    const t1 = setTimeout(() => setScanStage(2), 700);
    const t2 = setTimeout(() => setScanStage(3), 1400);
    const t3 = setTimeout(() => setScanStage(4), 2100);
    const t4 = setTimeout(() => {
      setIsScanning(false);
      setScanStage(0);
      showToast('Prescription scanned. Verification needed.', 'info');
      if (onFinish) onFinish();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  const loadDemoPrescription = () => {
    setPrescriptionLoaded(true);
    setMedicines(INITIAL_MEDICINES);
    startScan();
  };

  const verifyMedicine = (id: string) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isVerified: true, uncertainFields: [] } : m
      )
    );
    showToast('Field verified successfully.', 'success');
  };

  const updateMedicine = (id: string, updated: Partial<MedicineItem>) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ...updated, isVerified: true, uncertainFields: [] } : m
      )
    );
    showToast('Prescription field updated and verified.', 'success');
  };

  const createCarePlan = () => {
    if (!allVerified) {
      showToast('Please verify all highlighted fields before creating care plan.', 'alert');
      return;
    }
    setCarePlanCreated(true);
    showToast('Medication Care Plan created from verified data.', 'success');
  };

  // The WOW Moment: Patient marks medication as taken -> real-time sync with caregiver
  const markDoseTaken = (doseId: string) => {
    // 1. Set to confirming
    setDoses((prev) =>
      prev.map((d) => (d.id === doseId ? { ...d, status: 'confirming' } : d))
    );

    setTimeout(() => {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // 2. Set to confirmed
      setDoses((prev) =>
        prev.map((d) =>
          d.id === doseId
            ? { ...d, status: 'confirmed', confirmedAt: timeNow }
            : d
        )
      );

      // Confetti burst
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.65 },
          colors: ['#0d9488', '#0ea5e9', '#10b981'],
        });
      } catch {}

      // Broadcast across tabs/views
      syncBus.emit('DOSE_CONFIRMED', { doseId, confirmedAt: timeNow });
    }, 700);
  };

  const shareCarePlan = () => {
    setCaregiver((prev) => ({
      ...prev,
      lastShared: 'Just now',
    }));
    syncBus.emit('PLAN_SHARED', {});
    showToast('Care plan shared with Anjali.', 'success');
  };

  const sendReminder = () => {
    setCaregiver((prev) => ({
      ...prev,
      lastReminderSent: 'Just now',
    }));
    syncBus.emit('REMINDER_SENT', {});
    showToast('Reminder sent to Lakshmi.', 'info');
  };

  // ── Voice Confirmation Flow ──────────────────────────────────────────────

  const sendVoiceReminder = useCallback(() => {
    const payload = {
      medicine: reminderFlow.medicine,
      message: reminderFlow.message,
      messageTeluguText: reminderFlow.messageTeluguText,
    };
    // Update caregiver state
    setCaregiver((prev) => ({ ...prev, lastReminderSent: 'Just now' }));
    // Emit via syncBus (cross-tab + same-tab)
    syncBus.emit('VOICE_REMINDER', payload);
    // Speak the reminder aloud (for caregiver device)
    speechEngine.speak(reminderFlow.message, 'en');
    showToast('Voice reminder sent to Lakshmi.', 'info');
  }, [reminderFlow]);

  const patientAckHeard = useCallback(() => {
    syncBus.emit('PATIENT_HEARD', {});
    // On patient side: also speak confirmation
    speechEngine.speak(
      'I heard it. Let me get my medicine.',
      'en'
    );
  }, []);

  const patientAckHasMedicine = useCallback(() => {
    syncBus.emit('PATIENT_HAS_MEDICINE', {});
    speechEngine.speak('Yes, I have the medicine ready.', 'en');
  }, []);

  const patientAckTaken = useCallback(() => {
    syncBus.emit('PATIENT_TAKEN', {});
  }, []);

  const dismissReminder = useCallback(() => {
    setReminderFlow((prev) => ({ ...prev, status: 'idle' }));
    speechEngine.stop();
  }, []);

  // ────────────────────────────────────────────────────────────────────────

  const resetLocalState = () => {
    setMedicines(INITIAL_MEDICINES);
    setDoses(INITIAL_DOSES);
    setCarePlanCreated(true);
    setPrescriptionLoaded(true);
    setIsScanning(false);
    setScanStage(0);
    stopVoice();
    setReminderFlow({
      status: 'idle',
      medicine: 'Metformin 500 mg',
      message: "Lakshmi, it's time for your night medicine. Please take your Metformin after dinner.",
      messageTeluguText: 'లక్ష్మీ, రాత్రి భోజనం తర్వాత మీ మెట్ఫార్మిన్ మాత్ర తీసుకోవాలి.',
    });
  };

  const resetAll = () => {
    resetLocalState();
    syncBus.emit('RESET', {});
    showToast('Demo state reset.', 'info');
  };

  return (
    <RxBridgeContext.Provider
      value={{
        language,
        setLanguage,
        seniorMode,
        toggleSeniorMode,
        patient,
        caregiver,
        prescription,
        isScanning,
        scanStage,
        prescriptionLoaded,
        medicines,
        allVerified,
        carePlanCreated,
        doses,
        startScan,
        loadDemoPrescription,
        verifyMedicine,
        updateMedicine,
        createCarePlan,
        markDoseTaken,
        shareCarePlan,
        sendReminder,
        resetAll,
        reminderFlow,
        sendVoiceReminder,
        patientAckHeard,
        patientAckHasMedicine,
        patientAckTaken,
        dismissReminder,
        isVoicePlaying,
        speak,
        stopVoice,
        toast,
        clearToast,
      }}
    >
      {children}
    </RxBridgeContext.Provider>
  );
};

export const useRxBridge = () => {
  const context = useContext(RxBridgeContext);
  if (!context) {
    throw new Error('useRxBridge must be used within an RxBridgeProvider');
  }
  return context;
};
