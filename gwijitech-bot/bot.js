import { default as makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, initAuthCreds, proto } from '@whiskeysockets/baileys'
import { createClient } from '@supabase/supabase-js'
import { createStorageClient } from '@supabase/storage-js'
import pino from 'pino'
import { showMenu, showAIMenu, showSettingsMenu, showGroupMenu, showFunMenu } from './commands/menus.js'
import NodeCache from 'node-cache'
import fs from 'fs'
import path from 'path'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const storage = createStorageClient(process.env.SUPABASE_URL, { apikey: process.env.SUPABASE_SERVICE_KEY })
const BUCKET = 'baileys-session'
const msgRetryCounterCache = new NodeCache()

const BOT_NAME = 'GWIJITECH MD'
const PREFIX = '.'

// Custom auth state that saves to Supabase Storage
async function useSupabaseAuthState() {
    const dir = './session'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)

    // Download session from storage
    const { data } = await storage.from(BUCKET).list('')
    if(data) {
        for(const file of data) {
            const { data: fileData } = await storage.from(BUCKET).download(file.name)
            fs.writeFileSync(path.join(dir, file.name), Buffer.from(await fileData.arrayBuffer()))
        }
    }

    const { state, saveCreds } = await useMultiFileAuthState(dir)

    const saveToSupabase = async () => {
        const files = fs.readdirSync(dir)
        for(const file of files) {
            const fileData = fs.readFileSync(path.join(dir, file))
            await storage.from(BUCKET).upload(file, fileData, { upsert: true })
        }
    }

    return { state, saveCreds: async () => { await saveCreds(); await saveToSupabase() } }
}

async function startBot() {
    await storage.from(BUCKET).list('').catch(() => storage.createBucket(BUCKET, { public: false }))
    const { state, saveCreds } = await useSupabaseAuthState()

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'info' }),
        printQRInTerminal: true,
        msgRetryCounterCache,
        browser: Browsers.macOS('Chrome')
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
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
