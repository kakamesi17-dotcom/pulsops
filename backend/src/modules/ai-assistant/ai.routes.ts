import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router({ mergeParams: true });
const membersOnly = [authenticate, authorize(UserRole.MEMBER), tenantGuard];

const SYSTEM_PROMPT = `You are PulsBot, an elite AI fitness and nutrition assistant embedded inside the PulsOps Gym Management App.
You ONLY answer questions related to:
- Exercise technique, form, and execution
- Workout programming, routines, and periodization
- Nutrition, macros, calorie counting, and meal planning
- Recovery, sleep, supplementation
- Body composition and fitness goals
- Gym equipment and training safety

If a user asks anything outside fitness and nutrition (politics, coding, general knowledge, etc.), 
politely decline and redirect them to their fitness questions.

Always be motivating, precise, evidence-based, and practical. Format answers clearly.`;

// POST /api/gyms/:gymId/ai/chat
router.post('/chat', ...membersOnly, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { message } = req.body;
    const userId = req.user!.userId;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Message is required' } });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ success: false, error: { code: 'AI_UNAVAILABLE', message: 'AI assistant not configured' } });
      return;
    }

    // Fetch conversation history (last 10 messages)
    const history = await prisma.chatMessage.findMany({
      where: { gymId, userId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build chat history for Gemini
    const chatHistory = history.map((msg) => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m PulsBot, your dedicated fitness & nutrition AI. How can I help you today?' }] },
        ...chatHistory,
      ],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });

    const result = await chat.sendMessage(message.trim());
    const assistantReply = result.response.text();

    // Persist both messages
    await prisma.chatMessage.createMany({
      data: [
        { gymId, userId, role: 'user', content: message.trim() },
        { gymId, userId, role: 'assistant', content: assistantReply },
      ],
    });

    sendSuccess(res, { reply: assistantReply });
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/ai/history
router.get('/history', ...membersOnly, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const messages = await prisma.chatMessage.findMany({
      where: { gymId, userId: req.user!.userId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    sendSuccess(res, messages);
  } catch (err) { next(err); }
});

// DELETE /api/gyms/:gymId/ai/history  — clear chat
router.delete('/history', ...membersOnly, async (req, res, next) => {
  try {
    await prisma.chatMessage.deleteMany({
      where: { gymId: req.params.gymId, userId: req.user!.userId },
    });
    sendSuccess(res, null, 'Chat history cleared');
  } catch (err) { next(err); }
});

export default router;
