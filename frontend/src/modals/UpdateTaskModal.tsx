import { useState, useEffect } from 'react'
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
  
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('請先登入')
        return
      }
  
      const res = await fetch(`http://localhost:5003/task/${task.id}`, {
        method: 'PUT', // 如果你後端用 PATCH 就改成 'PATCH'
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: name,
          end_date: dueDate
        }),
      })
  
      if (!res.ok) {
        const errorText = await res.text()
        console.error('更新任務失敗：', errorText)
        alert(`更新任務失敗：\n${errorText}`)
        return
      }
  
      const data = await res.json()
  
      const updatedTask: Task = {
        ...task,
        name: data.title,
        dueDate: data.end_date,
        currentOwner: task.currentOwner,
        status: data.status || task.status,
      }
  
      onUpdate(updatedTask)
      onClose()
      alert('更新成功！')
  
    } catch (err) {
      console.error('更新任務錯誤', err)
      alert('伺服器錯誤，請稍後再試')
    }
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

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">取消</button>
            <button type="submit" className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  )
}
