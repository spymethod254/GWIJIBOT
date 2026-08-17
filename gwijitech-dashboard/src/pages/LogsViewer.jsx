import { useEffect,useState } from 'react'
import { supabase } from '../supabaseClient'
import AdminLayout from '../components/AdminLayout'
export default function LogsViewer() {
  const [logs,setLogs]=useState([])
  useEffect(()=>{const fetchLogs=async()=>{const {data:{user}}=await supabase.auth.getUser();const {data}=await supabase.from('logs').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50);setLogs(data)};fetchLogs()},[])
  return(<AdminLayout><h1 className="text-3xl font-bold mb-6">Message Logs</h1><div className="bg-gray-800 rounded-xl overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-700"><tr><th className="p-3">Sender</th><th className="p-3">Message</th><th className="p-3">Time</th></tr></thead><tbody>{logs.map(log=>(<tr key={log.id} className="border-t border-gray-700"><td className="p-3">{log.sender}</td><td className="p-3">{log.message}</td><td className="p-3">{new Date(log.created_at).toLocaleTimeString()}</td></tr>))}</tbody></table></div></AdminLayout>)
}
