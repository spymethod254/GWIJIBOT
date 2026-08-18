import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } from '@whiskeysockets/baileys'
import { createClient } from '@supabase/supabase-js'
import pino from 'pino'
import { showMenu, showAIMenu, showSettingsMenu, showGroupMenu, showFunMenu } from './commands/menus.js'
import NodeCache from 'node-cache'
import fs from 'fs/promises'
import path from 'path'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const BUCKET = 'baileys-session'
const SESSION_DIR = './session'
const msgRetryCounterCache = new NodeCache()

const BOT_NAME = 'GWIJITECH MD'
const PREFIX = '.'

async function downloadSession() {
    await fs.mkdir(SESSION_DIR, { recursive: true })
    const { data: files } = await supabase.storage.from(BUCKET).list()
    if(!files) return
    for(const file of files) {
        const { data } = await supabase.storage.from(BUCKET).download(file.name)
        if(data) await fs.writeFile(path.join(SESSION_DIR, file.name), Buffer.from(await data.arrayBuffer()))
    }
}

async function uploadSession() {
    const files = await fs.readdir(SESSION_DIR)
    for(const file of files) {
        const fileData = await fs.readFile(path.join(SESSION_DIR, file))
        await supabase.storage.from(BUCKET).upload(file, fileData, { upsert: true })
    }
}

async function startBot() {
    // Create bucket if not exists
    await supabase.storage.createBucket(BUCKET, { public: false }).catch(()=>{})
    await downloadSession()

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'warn' }),
        printQRInTerminal: true,
        msgRetryCounterCache,
        browser: Browsers.macOS('Chrome')
    })

    sock.ev.on('creds.update', async () => {
        await saveCreds()
        await uploadSession() // upload every time creds change
    })

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
