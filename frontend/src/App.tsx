import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import TaskListPage from './pages/TaskListPage'
import GroupPage from './pages/GroupPage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
         <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/groups" element={<GroupPage/>}/>
        {/* 之後再加 /login、/groups、/tasks … */}
      </Routes>
    </BrowserRouter>
  )
}
