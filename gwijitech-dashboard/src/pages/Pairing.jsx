import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
export default function Pairing() {
  const [code,setCode]=useState('Waiting...')
  const generateCode=()=>{setCode('PAIR-123-456')}
  return(<AdminLayout><h1 className="text-3xl font-bold mb-6">Pair WhatsApp Device</h1><div className="bg-gray-800 p-6 rounded-xl max-w-lg text-center"><p className="mb-4">1. Open WhatsApp > Settings > Linked Devices</p><p className="mb-4">2. Tap "Link a Device"</p><p className="mb-6">3. Enter this code:</p><div className="text-4xl font-bold bg-gray-700 p-4 rounded mb-6">{code}</div><button onClick={generateCode} className="bg-blue-600 px-6 py-3 rounded font-semibold">Generate New Code</button></div></AdminLayout>)
}
