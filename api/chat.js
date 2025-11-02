// This is api/chat.js (the new Vercel-friendly code)
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

// --- 1. Initialize Firebase Admin (Vercel Way) ---
try {
  const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (!serviceAccountBase64) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_BASE64 env var is not set.');
  }
  const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(serviceAccountJson);

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (e) {
  console.error("Firebase Admin initialization error:", e.message);
}
const db = admin.firestore();

// --- 2. Initialize Gemini AI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// --- 3. This is the Vercel Serverless Function ---
export default async function handler(req, res) {
  // Allow browsers to talk to this API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle the POST request from your chatbot
  if (req.method === 'POST') {
    try {
      const { history } = req.body; // Get history from client
      if (!history || history.length === 0) {
        return res.status(400).json({ error: 'History is required' });
      }

      const userMessage = history[history.length - 1].parts[0].text;

      // --- Log user message to Firestore ---
      const logRef = db.collection('chats').doc('main_chat').collection('messages');
      await logRef.add({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // --- Get AI reply (FIXED to use chat history) ---
      const chat = model.startChat({ history: history.slice(0, -1) }); // Send old history
      const result = await chat.sendMessage(userMessage); // Send the new message
      const response = await result.response;
      const aiText = response.text();

      // --- Log AI reply to Firestore ---
      await logRef.add({
        role: 'model', // This was a bug in your old code
        content: aiText,
        timestamp: new Date()
      });

      // Send the reply back to the chatbot
      res.status(200).json({ reply: aiText });

    } catch (error) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: 'Something went wrong on the server' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}