import React, { useState } from 'react';

const SectionList = ({ title, sectionKey, items, onAdd, onEdit, onDelete, fields }) => {
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [input, setInput] = useState({});
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setInput({});
    setAdding(true);
  };

  const handleEdit = (idx) => {
    setInput(items[idx]);
    setEditingIndex(idx);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const missing = fields.filter(f => (f.key === 'name' || f.key === 'illness' || f.key === 'allergen') && (!input[f.key] || input[f.key].trim() === ''));
    if (missing.length > 0) {
      setLocalError(`Please fill in: ${missing.map(f => f.label).join(', ')}`);
      return;
    }
    setLocalError('');
    if (adding) {
      onAdd(input);
      setAdding(false);
    } else if (editingIndex !== null) {
      onEdit(editingIndex, input);
      setEditingIndex(null);
    }
    setInput({});
  };


  const handleCancel = () => {
    setAdding(false);
    setEditingIndex(null);
    setInput({});
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="bg-[#5f6FFF] hover:bg-[#4c5bd4] text-white px-3 py-1 rounded text-sm"
          onClick={handleAdd}
          type="button"
        >
          Add New
        </button>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                {fields.map(f => (
                  <div key={f.key} className="text-sm text-gray-800 dark:text-gray-100">
                    <span className="font-medium">{f.label}:</span> {item[f.key] || <span className="italic text-gray-400">Not specified</span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="text-blue-600 hover:underline text-xs" onClick={() => handleEdit(idx)} type="button">Edit</button>
                <button className="text-red-500 hover:underline text-xs" onClick={() => onDelete(idx)} type="button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="italic text-gray-400">No records added yet.</div>
      )}
      {(adding || editingIndex !== null) && (
        <form onSubmit={handleSubmit} className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1">{f.label}</label>
              <input
                name={f.key}
                value={input[f.key] || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white"
                required={f.key === 'name' || f.key === 'illness' || f.key === 'allergen'}
              />
            </div>
          ))}
          {localError && <div className="text-red-500 text-xs font-medium mb-2">{localError}</div>}
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-[#5f6FFF] text-white px-3 py-1 rounded">{adding ? 'Add' : 'Save'}</button>
            <button type="button" className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-3 py-1 rounded" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SectionList;
