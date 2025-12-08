// server/app.js
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import controllers (needed for /chat render)
import * as chatController from './controllers/chatController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  name: 'connect.sid', // standardnavn; hvis du ændrer det, så brug samme i clearCookie
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
// Serve nye client-mappe
app.use('/client', express.static(path.join(__dirname, 'public', 'client')));

// Routes
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.redirect('/chat'); // eller en login-side
});

// Render chat-side
app.get('/chat', async (req, res) => {
  try {
    const chats = await chatController.getAllChats();
    res.render('chat', { user: req.session.user, chats });
  } catch (err) {
    console.error('Fejl ved render af chat:', err);
    res.status(500).send('Kunne ikke indlæse chats');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));