import React, { useState } from 'react';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Edit3,
  Check,
  Volume2,
  RefreshCw,
  Languages,
} from 'lucide-react';
import { useRxBridge } from '../context/RxBridgeContext';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { EditMedicineModal } from '../components/EditMedicineModal';
import { SafetyNotice } from '../components/SafetyNotice';
import type { MedicineItem } from '../types';

export const ScanVerifyScreen: React.FC<{ onNavigate: (tab: 'home' | 'scan' | 'plan' | 'caregiver') => void }> = ({
  onNavigate,
}) => {
  const {
    isScanning,
    scanStage,
    startScan,
    loadDemoPrescription,
    prescription,
    medicines,
    allVerified,
    verifyMedicine,
    updateMedicine,
    createCarePlan,
    language,
    setLanguage,
    speak,
    stopVoice,
    isVoicePlaying,
  } = useRxBridge();

  const [editingMedicine, setEditingMedicine] = useState<MedicineItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const scanStages = [
    'Reading prescription handwriting & format...',
    'Extracting medicines & clinical abbreviations...',
    'Understanding dosage & timing constraints...',
    'Checking information against Verification Gate...',
  ];

  const handleEditClick = (med: MedicineItem) => {
    setEditingMedicine(med);
    setIsEditModalOpen(true);
  };

  const handleCreatePlanClick = () => {
    createCarePlan();
    onNavigate('plan');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scan & Verify Prescription
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            AI extracts medication data with a mandatory human verification gate for patient safety.
          </p>
        </div>

        {/* Demo trigger buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => startScan()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Use Demo Prescription</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Workflow Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Upload & Prescription Document Visual */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Prescription Document
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {prescription.date}
              </span>
            </div>

            {/* Drag and drop upload zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                startScan();
              }}
              className={`p-4 border-2 border-dashed rounded-xl text-center transition-all ${
                dragOver
                  ? 'border-teal-500 bg-teal-50/50'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
              <p className="text-xs font-bold text-slate-700">
                Upload or drag & drop prescription image
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, PDF supported
              </p>
            </div>

            {/* Realistic Prescription Slip Card */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/90 font-mono text-xs space-y-3 relative overflow-hidden">
              <div className="border-b border-stone-200 pb-2 flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">{prescription.doctorName}</div>
                  <div className="text-[10px] text-slate-500">{prescription.clinicName}</div>
                </div>
                <span className="text-[10px] text-teal-800 font-bold bg-teal-100 px-1.5 py-0.5 rounded">
                  Rx Slip
                </span>
              </div>

              <div className="text-[11px] text-slate-700">
                Patient: <strong>{prescription.patientName}</strong> ({prescription.patientAge} F)
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-stone-200">
                  <div className="font-bold text-slate-900">1. Tab. Metformin 500mg</div>
                  <div className="text-slate-500">1-0-1 (BID) • After food (p.c.)</div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-stone-200">
                  <div className="font-bold text-slate-900">2. Tab. Amlodipine 5mg</div>
                  <div className="text-slate-500">1-0-0 (OD) • Morning (p.c.)</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: AI Processing & Verification Gate */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Header with language toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  AI Extraction & Verification Gate
                </h2>
                <p className="text-xs text-slate-500">
                  Review and verify extracted fields before generating care schedule
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    language === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  English
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

            {/* If Scanning is actively running */}
            {isScanning ? (
              <div className="py-8 text-center space-y-4">
                <RefreshCw className="w-8 h-8 mx-auto text-teal-600 animate-spin" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">AI Medical OCR Active</h3>
                  <p className="text-xs text-teal-700 font-medium">
                    {scanStages[scanStage - 1] || 'Processing prescription...'}
                  </p>
                </div>
              </div>
            ) : (
              /* Extracted Medicines List with Verification Gate */
              <div className="space-y-4">
                
                {medicines.map((med) => (
                  <div
                    key={med.id}
                    className={`p-4 rounded-xl border transition-all ${
                      med.isVerified
                        ? 'bg-slate-50/80 border-slate-200'
                        : 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-100'
                    }`}
                  >
                    {/* Medicine Header & Verification Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {med.name} {med.dosage}
                          </h3>
                          <span className="text-xs font-medium text-slate-500">
                            • {med.frequency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{med.timing}</p>
                      </div>

                      {/* Status Badge */}
                      {med.isVerified ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>✓ Verified</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>⚠ Needs verification</span>
                        </span>
                      )}
                    </div>

                    {/* Multilingual Plain-Language Explanation */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {language === 'te' ? 'సరళమైన సూచన (Telugu)' : 'Plain-Language Instruction'}
                        </span>

                        <VoiceWaveform
                          isSpeaking={isVoicePlaying}
                          onToggle={() => {
                            if (isVoicePlaying) {
                              stopVoice();
                            } else {
                              speak(
                                language === 'te' ? med.instructionTe : med.instruction,
                                language
                              );
                            }
                          }}
                          language={language}
                        />
                      </div>

                      <p className={`font-medium ${language === 'te' ? 'font-telugu text-slate-900 text-sm' : 'text-slate-700'}`}>
                        {language === 'te' ? med.instructionTe : med.instruction}
                      </p>
                    </div>

                    {/* THE SIGNATURE VERIFICATION GATE INTERACTION */}
                    {!med.isVerified && (
                      <div className="mt-3 p-3 bg-amber-100/70 rounded-lg border border-amber-200 text-xs space-y-2">
                        <div className="font-bold text-amber-950 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>{med.verificationQuestion || 'Did we read this dosage and timing correctly?'}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => verifyMedicine(med.id)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Yes, correct</span>
                          </button>

                          <button
                            onClick={() => handleEditClick(med)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-lg text-xs border border-slate-300 shadow-2xs transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}

            {/* Bottom Action Footer with Disabled/Enabled Gate */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {allVerified ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    All prescription fields verified. Ready for Care Plan.
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Please confirm uncertain fields to enable Care Plan creation.
                  </span>
                )}
              </div>

              <button
                onClick={handleCreatePlanClick}
                disabled={!allVerified}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  allVerified
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Create Care Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Edit Modal */}
      <EditMedicineModal
        medicine={editingMedicine}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(id, updated) => updateMedicine(id, updated)}
      />

      <SafetyNotice />

    </div>
  );
};
