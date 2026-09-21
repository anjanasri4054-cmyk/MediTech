import React, { useState } from 'react';
import { X, Check, Edit3, ShieldAlert } from 'lucide-react';
import type { MedicineItem } from '../types';

interface EditMedicineModalProps {
  medicine: MedicineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<MedicineItem>) => void;
}

export const EditMedicineModal: React.FC<EditMedicineModalProps> = ({
  medicine,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !medicine) return null;

  const [name, setName] = useState(medicine.name);
  const [dosage, setDosage] = useState(medicine.dosage);
  const [frequency, setFrequency] = useState(medicine.frequency);
  const [timing, setTiming] = useState(medicine.timing);
  const [instruction, setInstruction] = useState(medicine.instruction);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(medicine.id, {
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      timing: timing.trim(),
      instruction: instruction.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Edit3 className="w-4 h-4 text-teal-600" />
            <span>Edit Prescription Information</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Medicine Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Frequency</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Timing Details</label>
            <input
              type="text"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Patient Instructions</label>
            <textarea
              rows={2}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Verify</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
