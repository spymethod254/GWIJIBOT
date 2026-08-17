import { Link } from 'react-router-dom'
export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-4">GWIJITECH MD 🚀</h1>
      <p className="text-lg text-gray-400 mb-8 text-center max-w-xl">Control your WhatsApp bot from the web.</p>
      <div className="flex gap-4">
        <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">Get Started</Link>
        <Link to="/login" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold">Login</Link>
      </div>
    </div>
  )
}
