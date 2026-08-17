import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import Deploy from './pages/Deploy'
import Pairing from './pages/Pairing'
import LogsViewer from './pages/LogsViewer'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/pairing" element={<Pairing />} />
        <Route path="/logs" element={<LogsViewer />} />
      </Routes>
    </Router>
  )
}
