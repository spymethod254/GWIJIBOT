import { useState,useEffect } from 'react'
import { supabase } from '../supabaseClient'
import AdminLayout from '../components/AdminLayout'
export default function Deploy() {
  const [settings,setSettings]=useState({});const [loading,setLoading]=useState(false)
  useEffect(()=>{const fetchSettings=async()=>{const {data:{user}}=await supabase.auth.getUser();const {data}=await supabase.from('bot_settings').select('*').eq('user_id',user.id).single();setSettings(data)};fetchSettings()},[])
  const handleSave=async()=>{setLoading(true);const {data:{user}}=await supabase.auth.getUser();await supabase.from('bot_settings').update(settings).eq('user_id',user.id);alert('Settings saved!');setLoading(false)}
  return(<AdminLayout><h1 className="text-3xl font-bold mb-6">Deploy Settings</h1><div className="bg-gray-800 p-6 rounded-xl max-w-lg"><label className="block mb-2">Bot Name</label><input className="w-full p-3 mb-4 rounded bg-gray-700" value={settings.bot_name||''} onChange={e=>setSettings({...settings,bot_name:e.target.value})}/><label className="block mb-2">Command Prefix</label><input className="w-full p-3 mb-4 rounded bg-gray-700" value={settings.command_prefix||''} onChange={e=>setSettings({...settings,command_prefix:e.target.value})}/><label className="block mb-2">Bot Owner</label><input className="w-full p-3 mb-4 rounded bg-gray-700" value={settings.bot_owner||''} onChange={e=>setSettings({...settings,bot_owner:e.target.value})}/><button onClick={handleSave} className="w-full bg-green-600 p-3 rounded font-semibold">{loading?'Saving...':'Save & Restart Bot'}</button></div></AdminLayout>)
}
