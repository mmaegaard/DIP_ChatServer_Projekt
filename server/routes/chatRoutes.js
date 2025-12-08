//routes/chatRoutes

import express from 'express';
import * as chatController from '../controllers/chatController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Hent alle chats
router.get('/', async (req, res) => {
    const chats = await chatController.getAllChats();
    res.json(chats);
});

// Opret ny chat
router.post('/', authorize(2), async (req, res) => {
    try {
        const newChat = await chatController.createChat(req.session.user, req.body.name);
        res.status(201).json(newChat);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Rediger chat
router.put('/:id', authorize(2), async (req, res) => {
    try {
        const updatedChat = await chatController.editChat(req.session.user, req.params.id, req.body.name);
        res.json(updatedChat);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Slet chat
router.delete('/:id', authorize(2), async (req, res) => {
    try {
        await chatController.deleteChat(req.session.user, req.params.id);
        res.send('Chat deleted');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export default router;