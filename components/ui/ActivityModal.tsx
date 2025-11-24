/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppWindow, LeafyGreenIcon, Loader2, X } from 'lucide-react';
import React, { useState, useEffect, Fragment, cache } from 'react';
import CustomSelect, { categoryIcons } from './CustomSelect';
import { Category, EmissionFactor } from '@/types';
import { useRouter } from 'next/navigation';


type FormData = {
  category: Category | '';
  emission_factor_id: string;
  value: string;
  activity_date: string;
  notes: string;
};

type ActivityModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const categories: Category[] = ['Transport', 'Food', 'Energy', 'Waste'];

const initialFormState: FormData = {
  category: '',
  emission_factor_id: '',
  value: '',
  activity_date: new Date().toISOString().split('T')[0],
  notes: '',
};

type CustomSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export default function ActivityModal({ isOpen, onClose }: ActivityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const router = useRouter()
  const categoryOptions: CustomSelectOption[] = categories.map((cat) => ({
    value: cat,
    label: cat,
    icon: categoryIcons[cat],
  }));

  // Create options for Activity select based on chosen category
  const activityOptions: CustomSelectOption[] = emissionFactors
    .filter((factor) => factor.category === formData.category)
    .map((factor) => ({
      value: factor.id.toString(),
      label: factor.name,
    }));

  // Get the unit for the selected activity
  const selectedUnit = emissionFactors.find(
    (f) => f.id.toString() === formData.emission_factor_id
  )?.unit || 'units';

  useEffect(() => {
    const fetchEmissionFactors = async () => {
      try {
        const response = await fetch('/api/emission-factors', {cache:'force-cache'});
        const data = await response.json();
        setEmissionFactors(data);
      } catch (error) {
        console.error('Failed to fetch emission factors:', error);
      }
    };
    fetchEmissionFactors();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData(initialFormState);
        setMessage(null);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setFormData({
        ...initialFormState,
        activity_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [isOpen]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value as Category,
      emission_factor_id: ''
    }));
  };

  const handleActivityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      emission_factor_id: value
    }));
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emission_factor_id: formData.emission_factor_id,
          value: parseFloat(formData.value),
          activity_date: formData.activity_date,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Request failed");
      }

      setMessage({ type: "success", text: "Success! Your activity has been logged." });
      
      // --- CRITICAL STEP: Refresh Server Data ---
      router.refresh(); 

      setTimeout(() => onClose(), 1500);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };
  console.log('formdata', formData);
  if (!isOpen) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Scrollable Container - KEY for responsiveness */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          {/* Modal Panel */}
          <div
            className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all duration-300 sm:my-8 w-full sm:max-w-2xl ${isOpen ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="shrink-0 bg-emerald-100 text-emerald-600 rounded-full p-2 ring-1 ring-emerald-500/10">
                  <LeafyGreenIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-gray-900">
                  Log New Activity
                </h2>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                disabled={isLoading}
              >
                <span className="sr-only">Close</span>
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              {message && (
                <div
                  className={`p-4 mb-6 rounded-xl flex items-center gap-3 text-sm font-medium border ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Category Select */}
                <CustomSelect
                  label="Category"
                  value={formData.category}
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  placeholder="Select category..."
                  icon={formData.category ? categoryIcons[formData.category] : <AppWindow className="w-5 h-5" />}
                />

                {/* Activity Select */}
                <CustomSelect
                  label="Activity"
                  value={formData.emission_factor_id}
                  options={activityOptions}
                  onChange={handleActivityChange}
                  placeholder="Select activity..."
                  disabled={!formData.category}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                />

                {/* Amount Input */}
                <div>
                  <label htmlFor="activityValue" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative group md:hover:-translate-y-0.5 transition-transform duration-200 ease-in-out">
                    <input
                      type="number"
                      id="activityValue"
                      name="value"
                      value={formData.value}
                      onChange={handleFormChange}
                      step="0.01"
                      className="block w-full rounded-xl border-gray-200 bg-white py-3.5 pl-5 pr-16 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm sm:leading-6 transition-all active:scale-[0.99] md:active:scale-100"
                      placeholder="e.g., 10.5"
                      required
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                      <span className="text-gray-500 font-medium text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        {selectedUnit}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Date Input */}
                <div>
                  <label htmlFor="activityDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative group md:hover:-translate-y-0.5 transition-transform duration-200 ease-in-out">
                    <input
                      type="date"
                      id="activityDate"
                      name="activity_date"
                      value={formData.activity_date}
                      onChange={handleFormChange}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      className="block w-full rounded-xl border-gray-200 bg-white py-3.5 px-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm sm:leading-6 transition-all active:scale-[0.99] md:active:scale-100 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Notes Input */}
                <div className="md:col-span-2">
                  <label htmlFor="activityNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative group md:hover:-translate-y-0.5 transition-transform duration-200 ease-in-out">
                    <textarea
                      id="activityNotes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      rows={3}
                      className="block w-full rounded-xl border-gray-200 bg-white py-3.5 px-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm sm:leading-6 transition-all resize-y min-h-[100px]"
                      placeholder="Add any details here..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Log Activity'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}