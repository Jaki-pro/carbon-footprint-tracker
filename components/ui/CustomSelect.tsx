import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Category = 'Transport' | 'Food' | 'Energy' | 'Waste';

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m1.5 4.5h1.875a1.125 1.125 0 001.125-1.125V11.25c0-1.036-.84-1.875-1.875-1.875h-1.5c-1.036 0-1.875.84-1.875 1.875v3.75m1.5 4.5v-3.75m9 3.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h.008c.39 0 .74.22.912.556l.41 1.232c.11.331.43.561.79.561h.381c.62 0 1.125-.504 1.125-1.125V14.25m-1.5 4.5h-1.875a1.125 1.125 0 01-1.125-1.125V11.25c0-1.036.84-1.875 1.875-1.875h1.5c1.036 0 1.875.84 1.875 1.875v3.75m-1.5 4.5v-3.75" />
  </svg>
);

const FoodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 16.026a9.718 9.718 0 01-1.425 2.185 9.718 9.718 0 01-2.185 1.425m-8.15 0a9.718 9.718 0 01-2.185-1.425 9.718 9.718 0 01-1.425-2.185m11.75 0c.378-1.17.625-2.397.625-3.642V8.25c0-1.485-.609-2.85-1.606-3.844M11.25 4.406c-.378 1.17-.625 2.397-.625 3.642V8.25c0 1.485.609 2.85 1.606 3.844m-3 0a9.718 9.718 0 01-1.425-2.185 9.718 9.718 0 01-2.185-1.425m11.75 0c.378 1.17.625 2.397.625 3.642v3.393c0 1.245-.247 2.472-.625 3.642m-11.75 0c-.378-1.17-.625-2.397-.625-3.642v-3.393c0-1.245.247-2.472.625 3.642" />
  </svg>
);

const EnergyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const WasteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.548 0A48.108 48.108 0 016.75 5.394m0 0L6.22 5.242a1.5 1.5 0 00-1.897 1.13L2.25 9h19.5L19.664 6.372a1.5 1.5 0 00-1.897-1.13L16.5 5.394m-12.75 0l1.275 0" />
  </svg>
);

const CategoryIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2m14 0V9c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2m14 0h-2M5 11H3" />
    </svg>
);


// A map to render icons in the select
export const categoryIcons: Record<Category, React.ReactNode> = {
  Transport: <CarIcon />,
  Food: <FoodIcon />,
  Energy: <EnergyIcon />,
  Waste: <WasteIcon />,
};


type CustomSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type CustomSelectProps = {
  label: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { 
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); 
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative " ref={selectRef}>
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        id={label}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-75"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          {selectedOption ? (
            selectedOption.icon || icon
          ) : (
             icon || <CategoryIcon />
          )}
          <span className={`ml-2 block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon />
        </span>
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-100 ease-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'
        }`}
        style={{ transformOrigin: 'top' }}
      >
        <ul
          className="max-h-60 overflow-auto rounded-lg py-1 text-base sm:text-sm"
          role="listbox"
          aria-labelledby={label}
        >
          {options.length === 0 && !disabled && (
            <li className="relative cursor-default select-none py-2 px-4 text-gray-500">
              No options available
            </li>
          )}
          {options.map((option) => (
            <li
              key={option.value}
              className={`relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-gray-900 hover:bg-emerald-50 ${
                value === option.value ? 'bg-emerald-50 font-semibold' : ''
              }`}
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
            >
              <span className="flex items-center">
                {option.icon}
                <span className="ml-2 block truncate">{option.label}</span>
              </span>

              {value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-600">
                  <CheckIcon />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}