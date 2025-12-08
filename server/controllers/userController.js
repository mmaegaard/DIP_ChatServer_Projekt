// TODO: Maybe create a generateUserId method that connects to the database to prevent duplicate IDs?

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const usersFile = path.join(process.cwd(), 'data', 'users.json'); // i ESM findes __dirname ikke som i CommonJS

// Nu peger vi korrekt på server/data
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

// Hjælpefunktioner
function loadUsers() {
    return fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile)) : [];
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function generateUserId(users) {
    return users.length ? users[users.length - 1].id + 1 : 1;
}

// Opret bruger
export async function createUser(username, password, accessLevel = 1) {
    const users = loadUsers();

    // Tjek om brugernavn allerede findes
    if (users.find(u => u.username === username)) {
        throw new Error('Username already taken');
    }

    const newUser = {
        id: generateUserId(users),
        username,
        password, // OBS: Skal helst hashes senere!
        accessLevel
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Login
export async function login(username, password) {
    const users = loadUsers();

    // console.log('USERS length:', users.length); // Til debugging

    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
}

// Hent alle brugere (kun til admin)
export async function getAllUsers() {
    return loadUsers();
}

// Slet bruger (kun admin)
export async function deleteUser(userId) {
    let users = loadUsers();
    const index = users.findIndex(u => u.id == userId);
    if (index === -1) throw new Error('User not found');

    users.splice(index, 1);
    saveUsers(users);
    return true;
}