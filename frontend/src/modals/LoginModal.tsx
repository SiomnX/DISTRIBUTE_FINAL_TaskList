import { useState, FormEvent } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: 呼叫 login API
    console.log('login', username, password)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
        {/* 關閉 */}
        <button
          onClick={onClose}
          className="float-right text-sm text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <h2 className="mb-6 text-2xl font-bold text-blue-600">TaskManager</h2>
        <h3 className="mb-4 text-xl font-semibold">登入</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">使用者名稱</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入使用者名稱"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入密碼"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
          >
            登入
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          還沒有帳號？
          <button
            onClick={onSwitchToRegister}
            className="ml-1 text-blue-600 hover:underline"
          >
            立即註冊
          </button>
        </p>
      </div>
    </div>
  )
}