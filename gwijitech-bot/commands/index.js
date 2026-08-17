import { handleSettings } from './settings.js'

export async function handleCommand(sock, msg, command, args, settings, supabase) {
  const from = msg.key.remoteJid
  const p = settings.command_prefix

  // OWNER ONLY COMMANDS
  const ownerCommands = ['setbotname', 'setprefix', 'setownername', 'restart', 'broadcast']
  
  // Route to settings handler
  if(['setbotname', 'setprefix', 'setownername'].includes(command)) {
    return handleSettings(sock, msg, command, args, settings, supabase)
  }

  // OWNER ONLY
  if(ownerCommands.includes(command) && from !== sock.user.id) {
    return sock.sendMessage(from, { text: `❌ ${toSmallCaps('This command is owner only')}` })
  }

  if(command === 'restart') {
    await sock.sendMessage(from, { text: `🔄 ${toSmallCaps('Restarting GWIJITECH MD...')}` })
    process.exit(1) // Railway will auto restart it
  }

  if(command === 'owner') {
    return sock.sendMessage(from, { text: `👑 ${toSmallCaps('Owner')}: ${settings.bot_owner}` })
  }

  // CUSTOM COMMANDS FROM DATABASE
  const { data } = await supabase.from('commands').select('response').eq('user_id', settings.user_id).eq('trigger', command).single()
  if(data) return sock.sendMessage(from, { text: data.response })

  // COMMAND NOT FOUND
  await sock.sendMessage(from, { text: `❌ ${toSmallCaps('Command not found')}. ${toSmallCaps('Type')} ${p}menu` })
}

function toSmallCaps(str) {
  const map = {
    'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ',
    'n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'
  }
  return str.toLowerCase().split('').map(char => map[char] || char).join('')
}
