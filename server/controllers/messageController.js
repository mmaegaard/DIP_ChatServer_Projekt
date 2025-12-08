// controllers/messageController.js
// TODO: Maybe create a generateMessageId method that connects to the database to prevent duplicate IDs?

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const chatsFile = path.join(process.cwd(), 'data', 'chats.json'); // i ESM (Enterprise Service Management findes __dirname ikke som i CommonJS

// Korrekt sti til chats.json
const chatsFile = path.join(__dirname, '..', 'data', 'chats.json');

function loadChats() {
    return fs.existsSync(chatsFile) ? JSON.parse(fs.readFileSync(chatsFile)) : [];
}

function saveChats(chats) {
    fs.writeFileSync(chatsFile, JSON.stringify(chats, null, 2));
}

function generateMessageId(chat) {
    return chat.messages.length ? chat.messages[chat.messages.length - 1].id + 1 : 1;
}

/* ----------------------------
   READ HELPERS (REN ARKITEKTUR)
----------------------------- */

// Hent ALLE beskeder for en chat
export async function getMessages(chatId) {
  const chats = loadChats();
  const chat = chats.find(c => c.id == chatId);
  if (!chat) throw new Error('Chat not found');
  return chat.messages || [];
}

// (valgfri) Hent én bestemt besked fra en chat
export async function getMessageById(chatId, messageId) {
  const chats = loadChats();
  const chat = chats.find(c => c.id == chatId);
  if (!chat) throw new Error('Chat not found');
  const msg = (chat.messages || []).find(m => m.id == messageId);
  if (!msg) throw new Error('Message not found');
  return msg;
}

/* ----------------------------
   WRITE OPERATIONS
----------------------------- */

// Create message
export async function createMessage(user, chatId, messageContent) {
    const chats = loadChats();
    const chat = chats.find(c => c.id == chatId);
    if (!chat) throw new Error('Chat not found');

    const newMessage = {
        id: generateMessageId(chat),
        text: messageContent,
        ownerId: user.id,
        createdAt: new Date().toISOString()
    };

    chat.messages.push(newMessage);
    saveChats(chats);
    return newMessage;
}

// Edit message
export async function editMessage(user, chatId, messageId, newContent) {
    const chats = loadChats();
    const chat = chats.find(c => c.id == chatId);
    if (!chat) throw new Error('Chat not found');

    const message = chat.messages.find(m => m.id == messageId);
    if (!message) throw new Error('Message not found');

    if (user.accessLevel === 3 || message.ownerId === user.id) {
        message.text = newContent;
        saveChats(chats);
        return message;
    } else {
        throw new Error('Not allowed');
    }
}

// Delete message
export async function deleteMessage(user, chatId, messageId) {
    const chats = loadChats();
    const chat = chats.find(c => c.id == chatId);
    if (!chat) throw new Error('Chat not found');

    const index = chat.messages.findIndex(m => m.id == messageId);
    if (index === -1) throw new Error('Message not found');

    const message = chat.messages[index];
    if (user.accessLevel === 3 || message.ownerId === user.id) {
        chat.messages.splice(index, 1);
        saveChats(chats);
        return true;
    } else {
        throw new Error('Not allowed');
    }
}
