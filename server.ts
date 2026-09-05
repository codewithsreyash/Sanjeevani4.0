import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sanjeevani AI Rural Healthcare Continuity Gateway',
    timestamp: new Date().toISOString()
  });
});

// AI Voice & Clinical Guidance Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { query, language = 'en', role = 'patient', currentUser, patientContext } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      // Graceful signal to use rich local clinical engine
      res.json({
        fallback: true,
        reason: 'GEMINI_API_KEY_NOT_CONFIGURED',
        language
      });
      return;
    }

    const langInstructions =
      language === 'hi'
        ? 'IMPORTANT: Respond COMPLETELY in natural, polite Devanagari Hindi (हिन्दी). Do not mix English alphabets unnecessarily.'
        : language === 'mr'
        ? 'IMPORTANT: Respond COMPLETELY in natural, polite Devanagari Marathi (मराठी). Do not mix English alphabets unnecessarily.'
        : 'IMPORTANT: Respond in clear, empathetic, accessible English.';

    const systemPrompt = `You are Sanjeevani AI, an intelligent, empathetic rural healthcare continuity and clinical care assistant built for the National Health Mission and Ayushman Bharat Digital Mission (ABDM).

User Role: ${role} (${currentUser?.name || 'User'}, ${currentUser?.designation || 'Healthcare Participant'})
Active Patient Context: ${patientContext ? JSON.stringify(patientContext) : 'General healthcare query'}

Language Requirement:
${langInstructions}

Guidelines:
1. Provide medically accurate, caring, and practical advice tailored to rural and community healthcare settings in India.
2. If the user reports emergency symptoms (severe chest pain, severe breathlessness, convulsions, high fever with stiff neck, heavy bleeding during pregnancy), immediately emphasize dialing 108 or contacting the nearest ASHA/PHC right away.
3. Keep the response concise (2-4 sentences or short spoken paragraphs) because it will be read aloud by speech synthesis. Avoid asterisks, hashes, markdown tables, or difficult symbols that sound weird in Text-to-Speech.
4. Mention the patient's vitals, medicines, or next follow-up if relevant to their question.
5. Maintain a respectful, reassuring, and trustworthy tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question:\n${query}` }] }
      ]
    });

    const replyText = response.text || '';
    res.json({
      text: replyText.trim(),
      language,
      source: 'gemini-2.5-flash'
    });
  } catch (error: any) {
    console.warn('Gemini chat API error, falling back to local engine:', error?.message);
    res.json({
      fallback: true,
      error: error?.message || 'AI request failed',
      language: req.body?.language || 'en'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanjeevani AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
