// routes/userRoutes

import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Registrer ny bruger
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await userController.createUser(username, password);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
      console.log('LOGIN POST body:', req.body);
      const { username, password } = req.body;
      const user = await userController.login(username, password);

    if (user) {
      // Sørg for at user indeholder mindst: id, username, accessLevel
      req.session.user = {
        id: user.id,
        username: user.username,
        accessLevel: user.accessLevel ?? 1
      };
      // Redirect til chat-siden, så views får { user } injiceret
      return res.redirect('/chat');
    } else {
      return res.status(401).send('Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).send('Internal server error');
  }
});

// Login:
router.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
});

/**
 * Logout (POST anbefalet)
 * Destroy session + clear cookie + redirect
 */
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Fejl ved destroy under logout:', err);
      return res.status(500).send('Logout fejlede');
    }
    // Cookie-navnet er typisk 'connect.sid' (standard for express-session)
    // Match cookie options: mindst path:'/' (samme som i app.js session-cookie)
    res.clearCookie('connect.sid', { path: '/' });
    return res.redirect('/users/login');
  });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/chat');
});

// Hent alle brugere (kun admin)
router.get('/', async (req, res) => {
    const users = await userController.getAllUsers();
    res.json(users);
});

// Slet en bruger (kun admin)
router.delete('/:id', async (req, res) => {
    try {
        await userController.deleteUser(req.params.id);
        res.send('User deleted');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export default router;