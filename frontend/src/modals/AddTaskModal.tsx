import { useState, FormEvent } from 'react'

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
  onAdd: (newTask: Task) => void
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const groupId = 'GRP001' // 群組 ID 固定

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const newTask: Task = {
      id: 'TSK' + Date.now(),
      name,
      dueDate,
      currentOwner: groupId,
      status: '待處理',
    }

    onAdd(newTask)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="float-right text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>

        {/* 標題 */}
        <h2 className="mb-4 text-2xl font-bold text-blue-600">新增任務</h2>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 任務標題 */}
          <div>
            <label className="block text-sm font-medium">任務標題 *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          {/* 截止日期 */}
          <div>
            <label className="block text-sm font-medium">截止日期 *</label>
            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          {/* 群組 ID（預設值） */}
          <div>
            <label className="block text-sm font-medium">群組 ID</label>
            <input
              type="text"
              value={groupId}
              disabled
              className="w-full rounded border px-3 py-2 text-sm bg-gray-100 text-gray-500"
            />
          </div>

          {/* 按鈕區 */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 text-sm hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              新增
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
