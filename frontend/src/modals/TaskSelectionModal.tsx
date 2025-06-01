interface TaskDetails {
  id: string
  name: string
  dueDate: string
  currentOwner: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  task: TaskDetails
  onConfirm: () => void
}

export default function TaskSelectionModal({ isOpen, onClose, task, onConfirm }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="float-right text-sm text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <h2 className="mb-4 text-xl font-bold text-blue-600">確認接下任務</h2>
        <p className="mb-6 text-sm text-gray-600">請確認是否要接下此任務</p>

        {/* 任務詳細資訊 */}
        <div className="mb-4 rounded border bg-gray-50 p-4">
          <p className="mb-2 text-sm">
            <span className="font-semibold">任務 ID：</span>
            {task.id}
          </p>
          <p className="mb-2 text-sm">
            <span className="font-semibold">任務名稱：</span>
            {task.name}
          </p>
          <p className="mb-2 text-sm">
            <span className="font-semibold">截止日期：</span>
            {task.dueDate}
          </p>
          <p className="mb-2 text-sm">
            <span className="font-semibold">目前負責人：</span>
            {task.currentOwner}
          </p>
        </div>

        {/* 提示訊息 */}
        <div className="mb-6 rounded bg-yellow-50 p-3 text-sm text-yellow-700">
          ⚠️ 接下任務後，您將成為此任務的負責人
        </div>

        {/* 按鈕區域 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            確認接下
          </button>
        </div>
      </div>
    </div>
  )
}
