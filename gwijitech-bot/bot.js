import { default as makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import { createClient } from '@supabase/supabase-js'
import NodeCache from 'node-cache'
import { handleCommand } from './commands/index.js'
import { showMenu, showAIMenu, showSettingsMenu, showDownloadMenu, showGroupMenu, showFunMenu } from './commands/menus.js'
import { Boom } from '@hapi/boom'
import pino from 'pino'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const menuCache = new NodeCache({ stdTTL: 120 }) // 2 min menu state

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor(seconds % 3600 / 60)
  const s = Math.floor(seconds % 60)
  return `${h}h ${m}m ${s}s`
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['GWIJITECH MD', 'Chrome', '1.0.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if(qr) console.log('Scan QR or use pairing code')
    if(connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
      if(shouldReconnect) startBot()
    }
    if(connection === 'open') {
      console.log('GWIJITECH MD Connected ✅')
      // set profile name
      const { data: settings } = await supabase.from('bot_settings').select('*').single()
      if(settings) await sock.updateProfileName(settings.bot_name)
    }
  })

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    if (!body) return

    // get this bot's settings
    const botNumber = sock.user.id.split(':')[0]
    const { data: settings } = await supabase.from('bot_settings').select('*').eq('owner_phone', botNumber).single()
    if(!settings) return

    const p = settings.command_prefix
    const currentMenu = menuCache.get(from)

    // 1. LOG MESSAGE
    await supabase.from('logs').insert({
      user_id: settings.user_id,
      sender: from,
      message: body
    })

    // 2. HANDLE NUMBER REPLY FOR MENU
    if(/^[0-9]$/.test(body) && currentMenu) {
      const num = parseInt(body)
      if(num === 0) return showMenu(sock, from, settings)
      
      if(currentMenu === 'main') {
        if(num === 1) return showAIMenu(sock, from, p)
        if(num === 2) return showSettingsMenu(sock, from, p)
        if(num === 3) return showDownloadMenu(sock, from, p)
        if(num === 4) return showGroupMenu(sock, from, p)
        if(num === 5) return showFunMenu(sock, from, p)
      }
      return
    }

    // 3. HANDLE COMMANDS
    if(body.startsWith(p)) {
      const args = body.slice(p.length).trim().split(/ +/)
      const command = args.shift().toLowerCase()

      if(command === 'menu') return showMenu(sock, from, settings)
      if(command === 'ping') {
        const start = Date.now()
        const sent = await sock.sendMessage(from, { text: 'pong' })
        const end = Date.now()
        return sock.sendMessage(from, { text: `ᴘᴏɴɢ: ${end - start} ms`, edit: sent.key })
      }

      await handleCommand(sock, msg, command, args, settings, supabase)
    }
  })
}

startBot()
