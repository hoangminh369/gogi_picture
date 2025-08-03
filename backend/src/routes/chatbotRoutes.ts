import express from 'express';
import {
  getChatbotConfig,
  updateChatbotConfig,
  facebookWebhookVerify,
  getConversations,
  getMessagesByConversation,
  updateMessage,
  deleteMessage,
  updateConversation,
  deleteConversation
} from '../controllers/chatbotController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.get('/config', authenticate, getChatbotConfig);
router.put('/config', authenticate, updateChatbotConfig);

// Conversation routes
router.route('/conversations').get(authenticate, getConversations);
router.route('/conversations/:conversationId/messages').get(authenticate, getMessagesByConversation);
router.route('/conversations/:id')
  .put(authenticate, updateConversation)
  .delete(authenticate, deleteConversation);

// Message routes
router.route('/messages/:id')
  .put(authenticate, updateMessage)
  .delete(authenticate, deleteMessage);



export default router; 