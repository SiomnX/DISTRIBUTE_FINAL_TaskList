import { useState } from 'react'
import type { FormEvent } from 'react';

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
  const groupId = '1' // 群組 ID 固定

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('請先登入')
        return
      }

      const res = await fetch('http://localhost:5003/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: name,
          end_date: dueDate,
          group_id: parseInt(groupId),
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('新增任務失敗：', errorText)
        alert(`新增任務失敗：\n${errorText}`)
        return
      }
      
      const data = await res.json()

      // 整理成 Task 格式
      const newTask: Task = {
        id: String(data.id), // 假設後端回傳 id
        name: data.title,
        dueDate: data.end_date,
        currentOwner: groupId,
        status: data.status || 'pending',
      }

      onAdd(newTask)
      onClose()
      setName('')
      setDueDate('')
      alert('任務新增成功！')

    } catch (err) {
      console.error('新增任務錯誤', err)
      alert('伺服器錯誤，請稍後再試')
    }
  }

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