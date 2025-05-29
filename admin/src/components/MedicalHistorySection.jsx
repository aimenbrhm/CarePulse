import React, { useState } from 'react'
import { toast } from 'react-toastify'

const MedicalHistorySection = ({ medicalHistory, onSave, isEditable }) => {
  const [entries, setEntries] = useState(medicalHistory || [])
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState({
    condition: '',
    description: '',
    diagnosedAt: '',
    notes: ''
  })

  React.useEffect(() => {
    setEntries(medicalHistory || [])
  }, [medicalHistory])

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddOrUpdate = () => {
    if (!form.condition) {
      toast.error('Condition is required')
      return
    }
    let updatedEntries = [...entries]
    if (editIndex !== null) {
      updatedEntries[editIndex] = { ...form }
    } else {
      updatedEntries.push({ ...form })
    }
    setEntries(updatedEntries)
    setForm({ condition: '', description: '', diagnosedAt: '', notes: '' })
    setEditIndex(null)
    if (onSave) onSave(updatedEntries)
  }

  const handleEdit = (idx) => {
    setEditIndex(idx)
    setForm(entries[idx])
  }

  const handleDelete = (idx) => {
    const updated = entries.filter((_, i) => i !== idx)
    setEntries(updated)
    setEditIndex(null)
    setForm({ condition: '', description: '', diagnosedAt: '', notes: '' })
    if (onSave) onSave(updated)
  }

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-2">Medical History</h2>
      {isEditable && (
        <div className="mb-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <input name="condition" value={form.condition} onChange={handleInput} placeholder="Condition*" className="input input-bordered" />
          <input name="description" value={form.description} onChange={handleInput} placeholder="Description" className="input input-bordered" />
          <input name="diagnosedAt" value={form.diagnosedAt} onChange={handleInput} placeholder="Diagnosed At (YYYY-MM-DD)" className="input input-bordered" type="date" />
          <input name="notes" value={form.notes} onChange={handleInput} placeholder="Notes" className="input input-bordered" />
          <button onClick={handleAddOrUpdate} className="btn btn-primary col-span-1 md:col-span-4">{editIndex !== null ? 'Update' : 'Add'} Entry</button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Condition</th>
              <th>Description</th>
              <th>Diagnosed At</th>
              <th>Notes</th>
              {isEditable && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr><td colSpan={isEditable ? 5 : 4} className="text-center">No medical history found.</td></tr>
            )}
            {entries.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.condition}</td>
                <td>{entry.description}</td>
                <td>{entry.diagnosedAt ? entry.diagnosedAt.substring(0,10) : ''}</td>
                <td>{entry.notes}</td>
                {isEditable && (
                  <td>
                    <button className="btn btn-xs btn-info mr-2" onClick={() => handleEdit(idx)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(idx)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MedicalHistorySection
