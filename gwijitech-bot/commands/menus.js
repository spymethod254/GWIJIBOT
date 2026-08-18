import { toSmallCaps } from '../utils/text.js'

const BOT_NAME = 'GWIJITECH MD'

export function showMenu(prefix, senderName) {
  return `
╭─❏ *${toSmallCaps(BOT_NAME)}* ❏
│
│ *Hello ${senderName}* 👋
│ 
│ *Main Menu*
│ 
│  ${prefix}menu      - Show this menu
│  ${prefix}aimenu    - AI Commands
│  ${prefix}settings  - Bot Settings  
│  ${prefix}group     - Group Commands
│  ${prefix}fun       - Fun Commands
│  ${prefix}owner     - Contact Owner
│
╰─❏`
}

export function showAIMenu(prefix) {
  return `
╭─❏ *AI MENU* ❏
│
│  ${prefix}ai <text>     - Chat with AI
│  ${prefix}gemini <text> - Google Gemini
│  ${prefix}gpt <text>    - ChatGPT
│  ${prefix}imagine <prompt> - Generate Image
│
╰─❏`
}

export function showSettingsMenu(prefix) {
  return `
╭─❏ *SETTINGS MENU* ❏
│
│  ${prefix}setprefix <.>  - Change prefix
│  ${prefix}setbotname <name> - Change bot name
│  ${prefix}setowner <name> - Change owner name
│  ${prefix}addcmd <cmd> <reply> - Add custom command
│  ${prefix}delcmd <cmd> - Delete custom command
│
╰─❏`
}

export function showGroupMenu(prefix) {
  return `
╭─❏ *GROUP MENU* ❏
│
│  ${prefix}kick @user    - Kick member
│  ${prefix}add 254xxx    - Add member
│  ${prefix}promote @user - Promote admin
│  ${prefix}demote @user  - Demote admin
│  ${prefix}group open    - Open group
│  ${prefix}group close   - Close group
│  ${prefix}tagall        - Tag everyone
│
╰─❏`
}

export function showFunMenu(prefix) {
  return `
╭─❏ *FUN MENU* ❏
│
│  ${prefix}joke       - Get random joke
│  ${prefix}quote      - Random quote
│  ${prefix}fact       - Random fact
│  ${prefix}ship @user1 @user2 - Ship 2 people
│  ${prefix}pp         - Show profile pic
│
╰─❏`
}
