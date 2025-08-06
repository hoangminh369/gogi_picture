import { Request, Response } from 'express';
import ChatbotConfig from '../models/ChatbotConfig';
import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage';
import Conversation from '../models/Conversation';
import User from '../models/User';
import path from 'path';


// @desc    Get all conversations for a user
// @route   GET /api/chatbot/conversations
// @access  Private
export const getConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find({ userId: req.user?.id }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/chatbot/conversations/:conversationId/messages
// @access  Private
export const getMessagesByConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    // Validate conversationId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, error: 'Invalid Conversation ID' });
    }

    // Check if user has access to this conversation
    const conversation = await Conversation.findOne({ _id: conversationId, userId: req.user?.id });
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found or access denied' });
    }

    const messages = await ChatMessage.find({ conversationId }).sort({ createdAt: 'asc' });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages by conversation error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// @desc    Get chatbot configuration
// @route   GET /api/chatbot/config
// @access  Private
export const getChatbotConfig = async (req: Request, res: Response) => {
  try {
    const chatbotConfig = await ChatbotConfig.findOne({ userId: req.user?.id });

    if (!chatbotConfig) {
      return res.status(404).json({
        success: false,
        error: 'Chatbot configuration not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chatbotConfig,
    });
  } catch (error) {
    console.error('Get chatbot config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update chatbot configuration
// @route   PUT /api/chatbot/config
// @access  Private
export const updateChatbotConfig = async (req: Request, res: Response) => {
  try {
    const { zalo, facebook } = req.body;

    // Find existing config or create new one
    let chatbotConfig = await ChatbotConfig.findOne({ userId: req.user?.id });

    if (!chatbotConfig) {
      // Create new config
      chatbotConfig = await ChatbotConfig.create({
        zalo: {
          enabled: zalo?.enabled || false,
          accessToken: zalo?.accessToken || '',
          webhookUrl: zalo?.webhookUrl || '',
        },
        facebook: {
          enabled: facebook?.enabled || false,
          pageAccessToken: facebook?.pageAccessToken || '',
          verifyToken: facebook?.verifyToken || '',
          webhookUrl: facebook?.webhookUrl || '',
        },
        userId: req.user?.id,
      });
    } else {
      // Update existing config
      if (zalo) {
        chatbotConfig.zalo.enabled = zalo.enabled !== undefined ? zalo.enabled : chatbotConfig.zalo.enabled;
        chatbotConfig.zalo.accessToken = zalo.accessToken || chatbotConfig.zalo.accessToken;
        chatbotConfig.zalo.webhookUrl = zalo.webhookUrl || chatbotConfig.zalo.webhookUrl;
      }

      if (facebook) {
        chatbotConfig.facebook.enabled = facebook.enabled !== undefined ? facebook.enabled : chatbotConfig.facebook.enabled;
        chatbotConfig.facebook.pageAccessToken = facebook.pageAccessToken || chatbotConfig.facebook.pageAccessToken;
        chatbotConfig.facebook.verifyToken = facebook.verifyToken || chatbotConfig.facebook.verifyToken;
        chatbotConfig.facebook.webhookUrl = facebook.webhookUrl || chatbotConfig.facebook.webhookUrl;
      }

      await chatbotConfig.save();
    }

    res.status(200).json({
      success: true,
      data: chatbotConfig,
    });
  } catch (error) {
    console.error('Update chatbot config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};



// @desc    Handle Facebook webhook verification
// @route   GET /api/chatbot/webhook/facebook
// @access  Public
export const facebookWebhookVerify = async (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Find any user with this verify token
    const chatbotConfig = await ChatbotConfig.findOne({
      'facebook.verifyToken': token,
    });

    if (mode === 'subscribe' && token && chatbotConfig) {
      console.log('Facebook webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error('Facebook webhook verify error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};


// @desc    Update a message
// @route   PUT /api/chatbot/messages/:id
// @access  Private
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID'
      });
    }

    // Find the message and ensure it belongs to the user
    const chatMessage = await ChatMessage.findOne({
      _id: id,
      userId: req.user?.id,
      response: { $exists: false } // Only allow editing user messages, not bot responses
    });

    if (!chatMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or cannot be edited'
      });
    }

    // Update the message
    chatMessage.message = message;
    await chatMessage.save();

    res.status(200).json({
      success: true,
      data: chatMessage
    });
  } catch (error: any) {
    console.error('Update message error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @desc    Delete a message
// @route   DELETE /api/chatbot/messages/:id
// @access  Private
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate message ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID'
      });
    }

    // Find the message and ensure it belongs to the user
    const chatMessage = await ChatMessage.findOne({
      _id: id,
      userId: req.user?.id
    });

    if (!chatMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Delete the message
    await ChatMessage.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      data: { success: true }
    });
  } catch (error: any) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @desc    Update a conversation
// @route   PUT /api/chatbot/conversations/:id
// @access  Private
export const updateConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Conversation title is required'
      });
    }

    // Validate conversation ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }

    // Find the conversation and ensure it belongs to the user
    const conversation = await Conversation.findOne({
      _id: id,
      userId: req.user?.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Update the conversation
    conversation.title = title;
    await conversation.save();

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error: any) {
    console.error('Update conversation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @desc    Delete a conversation
// @route   DELETE /api/chatbot/conversations/:id
// @access  Private
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate conversation ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }

    // Find the conversation and ensure it belongs to the user
    const conversation = await Conversation.findOne({
      _id: id,
      userId: req.user?.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Delete all messages in the conversation
    await ChatMessage.deleteMany({ conversationId: id });

    // Delete the conversation
    await Conversation.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      data: { success: true }
    });
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
}; 