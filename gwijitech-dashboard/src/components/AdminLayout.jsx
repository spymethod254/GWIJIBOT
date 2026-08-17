import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const logout = async () => { await supabase.auth.signOut(); navigate('/login') }
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-8">GWIJITECH MD</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:text-blue-400">📊 Dashboard</Link>
          <Link to="/deploy" className="hover:text-blue-400">⚙️ Deploy</Link>
          <Link to="/pairing" className="hover:text-blue-400">📱 Pairing</Link>
          <Link to="/logs" className="hover:text-blue-400">📜 Logs</Link>
        </nav>
        <button onClick={logout} className="mt-10 bg-red-600 hover:bg-red-700 w-full py-2 rounded">Logout</button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
