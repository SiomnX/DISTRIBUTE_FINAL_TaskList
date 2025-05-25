import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (newTask: { id: string; name: string; dueDate: string; currentOwner: string; status: string }) => void
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [groupId, setGroupId] = useState('GRP001')

  const handleSubmit = () => {
    const newTask = {
      id: `TSK${Date.now()}`, // 自動生成任務 ID
      name,
      dueDate,
      currentOwner: '未指派', // 預設值
      status: '待處理', // 預設值
    }
    onAdd(newTask)
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
        <h2 className="mb-4 text-xl font-bold text-blue-600">新增任務</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="請輸入任務標題"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="text"
            placeholder="群組 ID"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
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
            新增
          </button>
        </div>
      </div>
    </div>
  )
}