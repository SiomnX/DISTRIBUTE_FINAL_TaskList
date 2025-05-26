import { useState, useEffect, FormEvent } from 'react'

interface Task {
  id: string
  name: string
  dueDate: string
  currentOwner: string
  status: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  task: Task
  onUpdate: (updatedTask: Task) => void
}

export default function UpdateTaskModal({ isOpen, onClose, task, onUpdate }: Props) {
  const [name, setName] = useState(task.name)
  const [dueDate, setDueDate] = useState(task.dueDate)
  const [currentOwner, setCurrentOwner] = useState(task.currentOwner)
  const [status, setStatus] = useState(task.status)

  useEffect(() => {
    setName(task.name)
    setDueDate(task.dueDate)
    setCurrentOwner(task.currentOwner)
    setStatus(task.status)
  }, [task])

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const updatedTask: Task = {
      ...task,
      name,
      dueDate,
      currentOwner,
      status,
    }
    onUpdate(updatedTask)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600 text-lg">×</button>
        <h2 className="mb-1 text-2xl font-bold text-blue-600">更新任務</h2>
        <p className="mb-4 text-sm text-gray-500">任務 ID: {task.id}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">任務標題 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm">截止日期 *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm">負責人</label>
            <input
              value={currentOwner}
              onChange={(e) => setCurrentOwner(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm">任務狀態</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="待處理">待處理</option>
              <option value="進行中">進行中</option>
              <option value="已完成">已完成</option>
            </select>
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
