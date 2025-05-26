import { useState } from 'react'
import NavBar from '../components/NavBar'
import LoginModal from '../modals/LoginModal'
import RegisterModal from '../modals/RegisterModal'

export default function WelcomePage() {
  /* ------- 控制兩個 Modal 開關 ------- */
  const [showLogin, setShowLogin]       = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. 頂部功能列 */}
      <NavBar
        primaryLabel="註冊"
        onPrimaryClick={() => setShowRegister(true)}
        secondaryLabel="登入"
        onSecondaryClick={() => setShowLogin(true)}
      />

      {/* 2. 主內容 */}
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-20">
        <h1 className="mb-4 text-5xl font-extrabold text-gray-800">
          歡迎使用任務管理系統
        </h1>
        <p className="mb-16 text-lg text-gray-500">
          高效管理您的團隊任務，提升工作效率
        </p>

        {/* 三大特色區塊 */}
        <section className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <Feature icon="👥" title="團隊協作" desc="與團隊成員共同管理任務" bgColor="bg-blue-200" />
          <Feature icon="✅" title="任務追蹤" desc="即時追蹤任務進度狀態" bgColor="bg-green-200"/>
          <Feature icon="⏰" title="期限管理" desc="設定並追蹤任務截止日期" bgColor="bg-amber-200"/>
        </section>
      </main>

      {/* 3. Modal 區域 */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
      />
    </div>
  )
}

/* -------- 子元件：特色卡片 -------- */
interface FeatureProps {
  icon: string
  title: string
  desc: string
  bgColor?: string
}
function Feature({ icon, title, desc, bgColor = 'bg-blue-500' }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`mb-3 flex h-20 w-20 items-center justify-center rounded-full text-4xl ${bgColor}`}>
        {icon}
      </div>
      <h3 className="mb-1 font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}
