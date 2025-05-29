import React from 'react';

const categories = [
  'Industry News',
  'Wellness Tips',
  'Patient Stories',
  'Tutorials',
  'Tech Innovations',
  'Research',
  'Seasonal Advice',
  'General',
];

export default function BlogCategories({ selected, onSelect }) {
  return (
    <>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`mx-1 mb-8 px-4 py-2 rounded-full border transition-all text-sm font-semibold ${selected === cat ? 'bg-[#5f6FFF] text-white border-[#5f6FFF]' : 'bg-white dark:bg-gray-800 text-[#5f6FFF] border-[#5f6FFF] dark:border-gray-700'}`}
        >
          {cat}
        </button>
      ))}
    </>
  );
}
