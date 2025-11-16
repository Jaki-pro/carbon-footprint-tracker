import { AppWindow, LeafyGreenIcon, Loader2, X } from 'lucide-react';
import React, { useState, useEffect, Fragment } from 'react';
import CustomSelect, { categoryIcons } from './CustomSelect';

type EmissionFactor = {
  id: number;
  name: string;
  category: Category;
  unit: string;
};

type Category = 'Transport' | 'Food' | 'Energy' | 'Waste';

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
  console.log('form data----->>>', formData);
  useEffect(() => {
    // In a real app, you'd fetch this from /api/emission-factors
    const fetchEmissionFactors = async () => {
      try {
        const response = await fetch('/api/emission-factors');
        const data = await response.json();
        setEmissionFactors(data);
      } catch (error) {
        console.error('Failed to fetch emission factors:', error);
      }
      finally { setIsLoading(false); }
    }
    setIsLoading(true);
    fetchEmissionFactors(); // Simulate network delay
  }, []);

  console.log('emission factors', emissionFactors);
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow closing animation
      const timer = setTimeout(() => {
        setFormData(initialFormState);
        setMessage(null);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // Set date to today when opening
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value as Category,
      emission_factor_id: '' // Reset activity when category changes
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emission_factor_id: formData.emission_factor_id,
          value: parseFloat(formData.value),
          activity_date: formData.activity_date,
          notes: formData.notes,
        }),
      });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setMessage({
        type: "success",
        text: "Success! Your activity has been logged.",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error: Could not log activity. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
          }`}
      >
        {/* Modal Panel */}
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="shrink-0 bg-emerald-100 text-emerald-600 rounded-full p-2">
                <LeafyGreenIcon />
              </div>
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                Log a New Activity
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              <X />
            </button>
          </div>

          {/* Modal Body with Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Custom Message Box */}
            {message && (
              <div
                className={`p-4 mb-4 rounded-lg text-sm ${message.type === 'success'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
                  }`}
                role="alert"
              >
                {message.text}
              </div>
            )}

            {/* Responsive Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

              {/* [NEW] Custom Category Select */}
              <CustomSelect
                label="Category"
                value={formData.category}
                options={categoryOptions}
                onChange={handleCategoryChange}
                placeholder="Select a category..."
                icon={formData.category ? categoryIcons[formData.category] : <AppWindow />}
              />

              {/* [NEW] Custom Activity Select */}
              <CustomSelect
                label="Activity"
                value={formData.emission_factor_id}
                options={activityOptions}
                onChange={handleActivityChange}
                placeholder="Select an activity..."
                disabled={!formData.category}
                icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
              />

              {/* Value / Amount */}
              <div>
                <label htmlFor="activityValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative transform transition-transform duration-200 hover:-translate-y-0.5">
                  <input
                    type="number"
                    id="activityValue"
                    name="value"
                    value={formData.value}
                    onChange={handleFormChange}
                    step="0.01"
                    className="block w-full rounded-2xl border-0 py-4 pl-5 pr-16 text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-gray-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-300  transition-all duration-200 sm:text-sm sm:leading-6"
                    placeholder="e.g., 10.5"
                    required
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-5">
                    <span className="text-gray-400 font-medium select-none">
                      {selectedUnit}
                    </span>
                  </span>
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="activityDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className='relative transform transition-transform duration-200 hover:-translate-y-0.5'>
                  <input
                    type="date"
                    id="activityDate"
                    name="activity_date"
                    value={formData.activity_date}
                    onChange={handleFormChange}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="block w-full rounded-2xl border-0 py-4 pl-5 pr-16 text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-gray-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-300  transition-all duration-200 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label htmlFor="activityNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <div className='relative transform transition-transform duration-200 hover:-translate-y-0.5'>

                  <textarea
                    id="activityNotes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                    className="block w-full rounded-2xl border-0 py-4 pl-5 pr-16 text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-gray-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-300  transition-all duration-200 sm:text-sm sm:leading-6"
                    placeholder="e.g., Drove to the office"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer with Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 text-white animate-spin" />
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
    </Fragment>
  );
}