// routes/messageRoutes.js

import express from 'express';
import * as chatController from '../controllers/chatController.js';
import * as messageController from '../controllers/messageController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Hent alle beskeder for en chat
router.get('/:chatId/messages', async (req, res) => {
  const chats = await chatController.getChatById(req.params.chatId);
  if (!chats) return res.status(404).send('Chat not found');
  res.json(chats.messages || []);
});

// Tilføj en besked til en chat
router.post('/:chatId/messages', authorize(1), async (req, res) => {
    try {
        const newMessage = await messageController.createMessage(
            req.session.user,
            req.params.chatId,
            req.body.text
        );
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Rediger en besked
router.put('/:chatId/messages/:messageId', authorize(1), async (req, res) => {
    try {
        const updatedMessage = await messageController.editMessage(
            req.session.user,
            req.params.chatId,
            req.params.messageId,
            req.body.text
        );
        res.json(updatedMessage);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Slet en besked
router.delete('/:chatId/messages/:messageId', authorize(1), async (req, res) => {
    try {
        await messageController.deleteMessage(
            req.session.user,
            req.params.chatId,
            req.params.messageId
        );
        res.send('Message deleted');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export default router;