import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const chatsFile = path.join(process.cwd(), 'data', 'chats.json'); 
// i ESM (Enterprise Service Management findes __dirname ikke som i CommonJS

// Korrekt sti til chats.json
const chatsFile = path.join(__dirname, '..', 'data', 'chats.json');

// Hjælpefunktioner til at læse og skrive
function loadChats() {
    return fs.existsSync(chatsFile) ? JSON.parse(fs.readFileSync(chatsFile)) : [];
}

function saveChats(chats) {
    fs.writeFileSync(chatsFile, JSON.stringify(chats, null, 2));
}

// Generér unikt message-ID
// Make this use UUID.
// === Outdated below ===
// id is 'msg_id' + the current time to the millisecond,
// for a total of 19 characters, 6 to define that it is a message id 
// and then 13 to make it unique (hopefully).
// === Outdated above ===
function generateMessageId() {
    return 'msg_id' + (new Date()).getTime();
}

/* ----------------------------
   READ HELPERS (REN ARKITEKTUR)
----------------------------- */

// Hent ALLE beskeder for en chat
export async function getMessages(chatId) {
  const chats = loadChats();
  const chat = chats.find(c => c.chatId == chatId);
  if (!chat) throw new Error('Chat not found');
  return chat.messages || [];
}

// (valgfri) Hent én bestemt besked fra en chat
export async function getMessageById(chatId, messageId) {
  const chats = loadChats();
  const chat = chats.find(c => c.chatId == chatId);
  if (!chat) throw new Error('Chat not found');
  const msg = (chat.messages || []).find(m => m.messageId == messageId);
  if (!msg) throw new Error('Message not found');
  return msg;
}

/* ----------------------------
   WRITE OPERATIONS
----------------------------- */

// Create message
export async function createMessage(user, chatId, messageText) {
    const chats = loadChats();
    const chat = chats.find(c => c.chatId == chatId);
    if (!chat) throw new Error('Chat not found');

    const newMessage = {
        messageId: generateMessageId(),
        messageText: messageText,
        ownerId: user.userId,
        creationDate: new Date().toISOString()
    };

    chat.messages.push(newMessage);
    saveChats(chats);
    return newMessage;
}

// Edit message
export async function editMessage(user, chatId, messageId, newMessageText) {
    const chats = loadChats();
    const chat = chats.find(c => c.chatId == chatId);
    if (!chat) throw new Error('Chat not found');

    const message = chat.messages.find(m => m.messageId == messageId);
    if (!message) throw new Error('Message not found');

    if (user.accessLevel === 3 || message.ownerId === user.userId) {
        message.messageText(newMessageText);
        saveChats(chats);
        return message;
    } else {
        throw new Error('Not allowed');
    }
}

// Delete message
export async function deleteMessage(user, chatId, messageId) {
    const chats = loadChats();
    const chat = chats.find(c => c.chatId == chatId);
    if (!chat) throw new Error('Chat not found');

    const index = chat.messages.findIndex(m => m.messageId == messageId);
    if (index === -1) throw new Error('Message not found');

    const message = chat.messages[index];
    if (user.accessLevel === 3 || message.ownerId === user.userId) {
        chat.messages.splice(index, 1);
        saveChats(chats);
        return true;
    } else {
        throw new Error('Not allowed');
    }
}