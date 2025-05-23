import { Link } from 'react-router-dom'

interface NavBarProps {
  /** 主要按鈕（藍底白字） */
  primaryLabel: string
  onPrimaryClick: () => void
  /** 次要按鈕（白底藍字，非必填） */
  secondaryLabel?: string
  onSecondaryClick?: () => void
}

export default function NavBar({
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
}: NavBarProps) {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          TaskManager
        </Link>

        {/* 右側區塊：可能有 1～2 顆按鈕 */}
        <div className="flex gap-3">
          {secondaryLabel && onSecondaryClick && (
            <button
              onClick={onSecondaryClick}
              className="rounded border border-blue-500 bg-white px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
            >
              {secondaryLabel}
            </button>
          )}

          <button
            onClick={onPrimaryClick}
            className="rounded bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600 transition"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </header>
  )
}
