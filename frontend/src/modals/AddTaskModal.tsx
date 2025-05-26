import { useState } from 'react'
import type { FormEvent } from 'react';

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: {
    title: string
    endDate: string
    groupId: string
  }) => void
  defaultGroupId?: string
}

export default function AddTaskModal({ isOpen, onClose, onSubmit, defaultGroupId = '' }: Props) {
  const [title, setTitle] = useState('')
  const [endDate, setEndDate] = useState('')
  const [groupId, setGroupId] = useState(defaultGroupId)

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title || !endDate) return alert('請填寫必要欄位')
    onSubmit({ title, endDate, groupId })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600">×</button>
        <h2 className="mb-6 text-2xl font-bold text-blue-600">新增任務</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">任務標題 *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
          </div>

          <div>
            <label className="block text-sm">截止日期 *</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
          </div>

          <div>
            <label className="block text-sm">群組 ID</label>
            <input value={groupId} onChange={(e) => setGroupId(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">取消</button>
            <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">新增</button>
          </div>
        </form>
      </div>
    </div>
  )
}

