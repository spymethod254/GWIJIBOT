import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } from '@whiskeysockets/baileys'
import { createClient } from '@supabase/supabase-js'
import pino from 'pino'
import { showMenu, showAIMenu, showSettingsMenu, showGroupMenu, showFunMenu } from './commands/menus.js'
import NodeCache from 'node-cache'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const msgRetryCounterCache = new NodeCache()

const BOT_NAME = 'GWIJITECH MD'
const PREFIX = '.'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'info' }),
        printQRInTerminal: true, // <-- QR will print in logs
        msgRetryCounterCache,
        browser: Browsers.macOS('Chrome')
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnecting:', shouldReconnect)
            if(shouldReconnect) startBot()
        } else if(connection === 'open') {
            console.log('✅ Connected to WhatsApp')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message || m.key.fromMe) return
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ''
        const sender = m.key.remoteJid
        const senderName = m.pushName || 'User'

        await supabase.from('logs').insert({ user_id: 'main-bot-owner-id', sender, message: body, type: 'text' })

        if(!body.startsWith(PREFIX)) return
        const args = body.slice(PREFIX.length).trim().split(/ +/)
        const cmd = args.shift().toLowerCase()

        if(cmd === 'menu') sock.sendMessage(sender, { text: showMenu(PREFIX, senderName) })
        if(cmd === 'aimenu') sock.sendMessage(sender, { text: showAIMenu(PREFIX) })
        if(cmd === 'settings') sock.sendMessage(sender, { text: showSettingsMenu(PREFIX) })
        if(cmd === 'group') sock.sendMessage(sender, { text: showGroupMenu(PREFIX) })
        if(cmd === 'fun') sock.sendMessage(sender, { text: showFunMenu(PREFIX) })
    })
}

startBot().catch(err => console.log(err))
