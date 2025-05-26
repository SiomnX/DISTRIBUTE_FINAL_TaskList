import { useState } from 'react'
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'TSK001',
      name: '設計系統建立',
      dueDate: '2024-01-20',
      currentOwner: 'alex.dev',
      status: '待處理',
    },
    {
      id: 'TSK002',
      name: '撰寫 API 文件',
      dueDate: '2024-01-25',
      currentOwner: '未指派',
      status: '進行中',
    },
  ])
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
      setUserTasks((prev) => [...prev, selectedTask])
      setModalOpen(false)
    }
  }

  // 刪除任務
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  // 更新任務
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
    setUpdateTaskModalOpen(false)
  }

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
          onAdd={(newTask) => setTasks((prev) => [...prev, newTask])}
        />
      )}
    </div>
  )
}