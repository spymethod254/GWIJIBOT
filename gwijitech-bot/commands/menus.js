import { toSmallCaps } from '../utils/text.js'

export async function showAIMenu(sock, from, p) {
  const menu = `
┏━━❐◈ ${toSmallCaps('AI MENU')} ◈
┃◈${p}ai <question>
┃◈${p}gpt4o <question>
┃◈${p}gemini <question>
┃◈${p}claude <question>
┃◈${p}metaai <question>
┗❐◈
_${toSmallCaps('Reply 0 to go back')}_
`.trim()
  await sock.sendMessage(from, { text: menu })
  menuCache.set(from, 'ai')
}

export async function showSettingsMenu(sock, from, p) {
  const menu = `
┏━━❐◈ ${toSmallCaps('SETTINGS MENU')} ◈
┃◈${p}setbotname <name>
┃◈${p}setprefix <char>
┃◈${p}setownername <name>
┃◈${p}setbotpp 
┃◈${p}restart
┗❐◈
_${toSmallCaps('Reply 0 to go back')}_
`.trim()
  await sock.sendMessage(from, { text: menu })
  menuCache.set(from, 'settings')
}
