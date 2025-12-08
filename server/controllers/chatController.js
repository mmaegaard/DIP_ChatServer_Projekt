// TODO: Maybe create a generateChatId method that connects to the database to prevent duplicate IDs?

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
function generateChatId(chats) {
    return chats.length ? chats[chats.length - 1].id + 1 : 1;
}

// Controller-metoder
export async function createChat(user, name) {
    const chats = loadChats();
    const newChat = {
        id: generateChatId(chats),
        name,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
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
    return chats.find(c => c.id == chatId);
}

export async function editChat(user, chatId, newName) {
    const chats = loadChats();
    const chat = chats.find(c => c.id == chatId);
    if (!chat) throw new Error('Chat not found');

    if (user.accessLevel === 3 || chat.ownerId === user.id) {
        chat.name = newName || chat.name;
        saveChats(chats);
        return chat;
    } else {
        throw new Error('Not allowed');
    }
}

export async function deleteChat(user, chatId) {
    const chats = loadChats();
    const index = chats.findIndex(c => c.id == chatId);
    if (index === -1) throw new Error('Chat not found');

    const chat = chats[index];
    if (user.accessLevel === 3 || chat.ownerId === user.id) {
        chats.splice(index, 1);
        saveChats(chats);
        return true;
    } else {
        throw new Error('Not allowed');
    }
}