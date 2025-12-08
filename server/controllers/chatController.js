import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const chatsFile = path.join(process.cwd(), 'data', 'chats.json'); // i ESM findes __dirname ikke som i CommonJS

// Korrekt sti til chats.json
const chatsFile = path.join(__dirname, '..', 'data', 'chats.json');

// Hjælpefunktioner til at læse og skrive
function loadChats() {
    return fs.existsSync(chatsFile) ? JSON.parse(fs.readFileSync(chatsFile)) : [];
}

function saveChats(chats) {
    fs.writeFileSync(chatsFile, JSON.stringify(chats, null, 2));
}

// Generér unikt chat-ID
// Make this use UUID.
// === Outdated below ===
// id is 'chat_id' + the current time to the millisecond,
// for a total of 20 characters, 7 to define that it is a chat id 
// and then 13 to make it unique (hopefully).
// === Outdated above ===
function generateChatId() {
    return 'chat_id' + (new Date()).getTime();
}

// Controller-metoder
export async function createChat(user, chatName) {
    const chats = loadChats();
    const newChat = {
        id: generateChatId(),
        chatName,
        createdAt: new Date().toISOString(),
        ownerId: user.id,
        messages: []
    };
    chats.push(newChat);
    saveChats(chats);
    return newChat;
}

export async function getAllChats() {
    return loadChats();
}

export async function getChatById(chatId) {
    const chats = loadChats();
    return chats.find(c => c.chatId == chatId);
}

export async function editChat(user, chatId, newName) {
    const chats = loadChats();
    const chat = chats.find(c => c.chatId == chatId);
    if (!chat) throw new Error('Chat not found');

    if (user.accessLevel === 3 || chat.ownerId === user.userId) {
        chat.chatName = newName || chat.chatName;
        saveChats(chats);
        return chat;
    } else {
        throw new Error('Not allowed');
    }
}

export async function deleteChat(user, chatId) {
    const chats = loadChats();
    const index = chats.findIndex(c => c.chatId == chatId);
    if (index === -1) throw new Error('Chat not found');

    const chat = chats[index];
    if (user.accessLevel === 3 || chat.ownerId === user.userId) {
        chats.splice(index, 1);
        saveChats(chats);
        return true;
    } else {
        throw new Error('Not allowed');
    }
}