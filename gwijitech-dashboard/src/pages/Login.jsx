import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const navigate=useNavigate()
  const handleLogin=async(e)=>{e.preventDefault();const {error}=await supabase.auth.signInWithPassword({email,password});if(error)return alert(error.message);navigate('/admin')}
  return(<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4"><form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl w-full max-w-md"><h2 className="text-2xl font-bold mb-6">Login</h2><input className="w-full p-3 mb-4 rounded bg-gray-700" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="w-full p-3 mb-4 rounded bg-gray-700" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="w-full bg-blue-600 p-3 rounded font-semibold">Login</button></form></div>)
}
