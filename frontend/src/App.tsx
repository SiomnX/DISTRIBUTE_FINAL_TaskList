import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import TaskListPage from './pages/TaskListPage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
         <Route path="/tasks" element={<TaskListPage />} />
        {/* 之後再加 /login、/groups、/tasks … */}
      </Routes>
    </BrowserRouter>
  )
}
