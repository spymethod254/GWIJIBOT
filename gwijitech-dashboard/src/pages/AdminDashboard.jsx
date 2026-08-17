import { useEffect,useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
export default function AdminDashboard() {
  const [stats,setStats]=useState({users:0,commands:0,uptime:'0h'})
  useEffect(()=>{const fetchStats=async()=>{const {count:users}=await supabase.from('bot_settings').select('*',{count:'exact',head:true});const {count:commands}=await supabase.from('commands').select('*',{count:'exact',head:true});setStats({users,commands,uptime:'3h 12m'})};fetchStats()},[])
  return(<AdminLayout><h1 className="text-3xl font-bold mb-6">Dashboard</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><StatCard title="Total Users" value={stats.users}/><StatCard title="Active Commands" value={stats.commands}/><StatCard title="Bot Uptime" value={stats.uptime}/></div><div className="mt-8 flex gap-4"><Link to="/deploy" className="bg-green-600 px-4 py-2 rounded">Deploy Bot</Link><Link to="/pairing" className="bg-blue-600 px-4 py-2 rounded">Pair Device</Link></div></AdminLayout>)
}
