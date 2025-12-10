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

// Controller-metoder
export async function createChat(user, chatName) {
    const chats = loadChats();

    // Genererer et uuid til den nye besked.
    let uuid = Crypto.randomUUID();

    const newChat = {
        id: uuid,
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