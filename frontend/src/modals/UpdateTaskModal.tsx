import { useState } from 'react'

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

  const handleSubmit = () => {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="float-right text-sm text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="mb-4 text-xl font-bold text-blue-600">更新任務</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="任務名稱"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="date"
            placeholder="截止日期"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="text"
            placeholder="負責人"
            value={currentOwner}
            onChange={(e) => setCurrentOwner(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="待處理">待處理</option>
            <option value="進行中">進行中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            確認更新
          </button>
        </div>
      </div>
    </div>
  )
}