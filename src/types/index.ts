export type Language = 'en' | 'te';

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  instruction: string;
  instructionTe: string;
  isVerified: boolean;
  uncertainFields: ('name' | 'dosage' | 'frequency' | 'timing' | 'instruction')[];
  verificationQuestion?: string;
}

export interface MedicationDose {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  period: 'Morning' | 'Night';
  instruction: string;
  instructionTe: string;
  status: 'pending' | 'confirming' | 'confirmed';
  confirmedAt?: string;
}

export interface CaregiverInfo {
  name: string;
  relationship: string;
  connected: boolean;
  lastShared?: string;
  lastReminderSent?: string;
}

export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  preferredLanguage: Language;
}

export interface PrescriptionDoc {
  doctorName: string;
  clinicName: string;
  date: string;
  patientName: string;
  patientAge: number;
  medicines: MedicineItem[];
}
