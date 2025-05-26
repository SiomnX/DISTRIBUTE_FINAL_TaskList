import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TaskSelectionModal from '../modals/TaskSelectionModal'
import UpdateTaskModal from '../modals/UpdateTaskModal'
import AddTaskModal from '../modals/AddTaskModal'

interface Task {
  id: string
  name: string
  dueDate: string
  currentOwner: string
  status: string
}
// TaskPage() 是這頁的主元件
export default function TaskPage() {
    // tasks	所有任務的清單（預設兩個任務）
  const [tasks, setTasks] = useState<Task[]>([/*
    {
      id: 'TSK001',
      name: '設計系統建立',
      dueDate: '2024-01-20',
      currentOwner: 'alex.dev',
      status: 'pending',
    },
    {
      id: 'TSK002',
      name: '撰寫 API 文件',
      dueDate: '2024-01-25',
      currentOwner: '未指派',
      status: 'in_process',
    },
    {
      id: 'TSK003',
      name: '測試',
      dueDate: '2024-01-13',
      currentOwner: '未指派',
      status: 'completed',
    },
  */])

  const { id } = useParams()
  const groupId = id || '1'  // 若網址中沒有 id，預設使用 1

  // userTasks	使用者自己已接下的任務
  const [userTasks, setUserTasks] = useState<Task[]>([])
  // selectedTask	當前被選中的任務（用於顯示模態視窗）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  // isModalOpen	控制【接任務】的模態視窗是否開啟
  const [isModalOpen, setModalOpen] = useState(false)
  // isAddTaskModalOpen	控制【新增任務】視窗是否開啟
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false)
  // isUpdateTaskModalOpen	控制【更新任務】視窗是否開啟
  const [isUpdateTaskModalOpen, setUpdateTaskModalOpen] = useState(false)

  // 選取任務
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setModalOpen(true)
  }

  // 確認接下任務
  const handleConfirmTask = () => {
    if (selectedTask) {
      const alreadySelected = userTasks.some(task => task.id === selectedTask.id)
      if (alreadySelected) {
        alert('你已接下此任務')
      } else {
        setUserTasks((prev) => [...prev, selectedTask])
      }
      setModalOpen(false)
    }
  }

  // 刪除任務
  const handleDeleteTask = async (taskId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('請先登入')
      return
    }
  
    if (!window.confirm('確定要刪除這個任務嗎？')) return
  
    try {
      const res = await fetch(`http://localhost:5003/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }
  
      const data = await res.json()
      console.log('刪除成功:', data)
  
      // 從畫面上移除該任務
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      alert('任務刪除成功')
  
    } catch (err) {
      console.error('刪除任務失敗', err)
      alert('刪除任務失敗，請稍後再試')
    }
  }
  

  // 更新任務
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
    setUpdateTaskModalOpen(false)
  }

  const handleSubmitAllUserTasks = () => {
    if (userTasks.length === 0) {
      alert('你尚未選擇任何任務')
      return
    }

    fetch('/api/submitTasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userTasks), // 一次送出多筆任務
    })
      .then((res) => {
        if (res.ok) {
          alert('成功送出任務 ✅')
          setUserTasks([]) // 清空畫面
          // 可選：重新載入任務列表
          // fetchTasksFromServer()
        } else {
          alert('送出失敗 ❌')
        }
      })
      .catch(() => {
        alert('發生錯誤，請稍後再試')
      })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-purple-100 text-purple-400'
      case 'in_process':
        return 'bg-blue-100 text-blue-400'
      case 'completed':
        return 'bg-green-100 text-green-400'
      default:
        return 'bg-gray-400 text-gray-600'
    }
  }

  const handleCreateTask = (newTask: any) => {
    setTasks((prev) => [...prev, newTask]);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('請先登入')
        return
      }
  
      try {
        const res = await fetch(`http://localhost:5003/group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        }
  
        const data = await res.json()
        setTasks(
          data.map((task: any) => ({
            id: String(task.id),
            name: task.title,
            dueDate: task.end_date?.slice(0, 10) || '', // yyyy-mm-dd
            currentOwner: '未指派', // 目前後端沒傳這個欄位
            status: task.status,
          }))
        )        

      } catch (err) {
        console.error('取得任務失敗', err)
        alert('取得任務失敗，請稍後再試')
      }
    }
  
    fetchTasks()
  }, [groupId])

  return (
    <div className="p-6">
      {/* 頁面標題 */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">TaskManager</h1>
        <div className="flex items-center gap-4">
          {/* 通知按鈕 */}
          <div className="relative">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
              <span className="text-lg">🔔</span>
            </button>
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
          </div>
          {/* 使用者資訊 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                U
              </div>
              <div>
                <p className="text-sm font-semibold">username123</p>
                <p className="text-xs text-gray-500">ID: 12345</p>
              </div>
            </div>
            <button className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">
              登出
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* 任務列表 */}
        <div className="col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">任務清單</h2>
            <button
              onClick={() => setAddTaskModalOpen(true)}
              className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
            >
              新增任務
            </button>
          </div>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded border bg-white p-4 shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold">{task.name}</h3>
                  <p className="text-sm text-gray-600">
                    截止日期：{task.dueDate} | 負責人：{task.currentOwner}
                  </p>
                 <p className={`inline-block rounded px-2 py-0.5 text-xs text-white font-semibold ${getStatusColor(task.status)}`}>
                  <span className={`h-3 w-3 rounded-sm ${getStatusColor(task.status).split(' ')[0]}`}></span>
                  <span>{task.status}</span>
                </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectTask(task)}
                    className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                  >
                    選取
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task)
                      setUpdateTaskModalOpen(true)
                    }}
                    className="rounded bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600"
                  >
                    更新
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用者的任務 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">我的任務</h2>
          <div className="space-y-4">
            {userTasks.map((task) => (
              <div
                key={task.id}
                className="rounded border bg-gray-50 p-4 shadow"
              >
                <h3 className="text-sm font-semibold">{task.name}</h3>
                <p className="text-xs text-gray-500">截止日期：{task.dueDate}</p>
                <p className="text-xs text-gray-500">負責人：{task.currentOwner}</p>
                <p className="text-xs text-gray-500">狀態：{task.status}</p>
              </div>
            ))}
          </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleSubmitAllUserTasks()}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                一次送出
              </button>
            </div>
          </div>
        
      </div>

      {/* 確認接下任務的模態視窗 */}
      {selectedTask && (
        <TaskSelectionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          task={selectedTask}
          onConfirm={handleConfirmTask}
        />
      )}

      {/* 更新任務的模態視窗 */}
      {selectedTask && isUpdateTaskModalOpen && (
        <UpdateTaskModal
          isOpen={isUpdateTaskModalOpen}
          onClose={() => setUpdateTaskModalOpen(false)}
          task={selectedTask}
          onUpdate={handleUpdateTask}
        />
      )}

      {/* 新增任務的模態視窗 */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setAddTaskModalOpen(false)}
          onAdd={handleCreateTask}
          groupId = {groupId} 
        />
      )}
    </div>
  )
}