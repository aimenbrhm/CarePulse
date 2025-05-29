import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const GENDERS = [
  '', 'male', 'female'
];

const LABELS = {
  '': 'Select gender',
  male: 'Male',
  female: 'Female',
};

export default function GenderDropdown({ value, onChange, disabled }) {
  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <Listbox.Label className="block font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Gender
            </Listbox.Label>
            <div className="relative">
              <Listbox.Button
                className={`w-full bg-white dark:bg-[#23272e] border-b-2 border-gray-300 focus:border-blue-400 dark:focus:border-blue-400 outline-none text-black dark:text-white text-base pt-6 pb-2 px-3 rounded-xl shadow transition-all flex items-center justify-between ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span>{LABELS[value]}</span>
                <FaChevronDown className="ml-2 text-gray-400" />
              </Listbox.Button>
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-[#23272e] py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none">
                {GENDERS.map((type) => (
                  <Listbox.Option
                    key={type}
                    value={type}
                    as={Fragment}
                  >
                    {({ selected, active }) => (
                      <li
                        className={`
                          cursor-pointer select-none relative py-3 px-4
                          ${active ? 'bg-blue-100 dark:bg-gray-700' : ''}
                          ${selected ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-black dark:text-white'}
                        `}
                      >
                        {LABELS[type]}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
