import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        {/* 之後再加 /login、/groups、/tasks … */}
      </Routes>
    </BrowserRouter>
  )
}
