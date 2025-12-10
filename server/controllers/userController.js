import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const usersFile = path.join(process.cwd(), 'data', 'users.json'); 
// // i ESM findes __dirname ikke som i CommonJS

// Nu peger vi korrekt på server/data
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

// Hjælpefunktioner
function loadUsers() {
    return fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile)) : [];
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Generér unikt user-ID
// Make this use UUID.
// === Outdated below ===
// id is 'user_id' + the current time to the millisecond,
// for a total of 20 characters, 7 to define that it is a user id 
// and then 13 to make it unique (hopefully).
// === Outdated above ===
function generateUserId() {
    return 'user_id' + (new Date()).getTime();
}

// Opret bruger
export async function createUser(userName, password, accessLevel = 1) {
    const users = loadUsers();

    // Tjek om brugernavn allerede findes
    if (users.find(u => u.userName === userName)) {
        throw new Error('Username already taken');
    }

    const newUser = {
        userId: generateUserId(),
        userName,
        password, // OBS: Skal helst hashes senere!
        creationDate: new Date().toISOString(),
        accessLevel
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Login
export async function login(userName, password) {
    const users = loadUsers();

    // console.log('USERS length:', users.length); // Til debugging

    const user = users.find(u => u.userName === userName && u.password === password);
    return user || null;
}

// Hent alle brugere (kun til admin)
export async function getAllUsers() {
    return loadUsers();
}

// Slet bruger (kun admin)
export async function deleteUser(userId) {
    let users = loadUsers();
    const index = users.findIndex(u => u.userId == userId);
    if (index === -1) throw new Error('User not found');

    users.splice(index, 1);
    saveUsers(users);
    return true;
}