function toSmallCaps(str) {
  const map = {
    'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ',
    'n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'
  }
  return str.toLowerCase().split('').map(char => map[char] || char).join('')
}

export async function handleSettings(sock, msg, command, args, settings, supabase) {
  const from = msg.key.remoteJid
  const value = args.join(' ')
  const p = settings.command_prefix
  
  if(!value) return sock.sendMessage(from, { 
    text: `❌ ${toSmallCaps('Usage')}: ${p}${command} <${toSmallCaps('value')}>` 
  })

  let update = {}
  let reply = ''

  if(command === 'setbotname') {
    update = { bot_name: value }
    reply = `✅ ${toSmallCaps('Bot name updated to')}: *${value}*`
    await sock.updateProfileName(value) // update WA profile name instantly
  }
  
  if(command === 'setprefix') {
    if(value.length > 2) return sock.sendMessage(from, { text: `❌ ${toSmallCaps('Prefix too long. Max 2 characters')}` })
    update = { command_prefix: value }
    reply = `✅ ${toSmallCaps('Command prefix updated to')}: *${value}*`
  }
  
  if(command === 'setownername') {
    update = { bot_owner: value }
    reply = `✅ ${toSmallCaps('Bot owner updated to')}: *${value}*`
  }

  const { error } = await supabase.from('bot_settings').update(update).eq('user_id', settings.user_id)

  if(error) return sock.sendMessage(from, { text: `❌ ${toSmallCaps('Error')}: ${error.message}` })
  await sock.sendMessage(from, { text: reply })
}
