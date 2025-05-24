import { useState, FormEvent, useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  taskId: string
  initialTitle: string
  initialEndDate: string
  onSubmit: (update: {
    taskId: string
    title: string
    endDate: string
  }) => void
}

export default function UpdateTaskModal({
  isOpen,
  onClose,
  taskId,
  initialTitle,
  initialEndDate,
  onSubmit
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [endDate, setEndDate] = useState(initialEndDate)

  useEffect(() => {
    setTitle(initialTitle)
    setEndDate(initialEndDate)
  }, [initialTitle, initialEndDate])

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ taskId, title, endDate })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600">×</button>
        <h2 className="mb-1 text-2xl font-bold text-blue-600">更新任務</h2>
        <p className="mb-4 text-sm text-gray-500">任務 ID: {taskId}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">任務標題 *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
          </div>

          <div>
            <label className="block text-sm">截止日期 *</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">取消</button>
            <button type="submit" className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  )
}

