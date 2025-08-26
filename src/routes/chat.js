import express from "express";
import { OpenAI } from "openai";
import { CohereClient } from "cohere-ai";
import { config } from "../config.js";
import { health, chat } from "../controllers/chatController.js";

const router = express.Router();

// Init clients
const openai = new OpenAI({ apiKey: config.openaiKey });
const cohere = new CohereClient({ token: config.cohereKey });

// --- Health Check ---
router.get("/health", health);

// --- Main Chat Endpoint ---
router.post("/chat", chat);

// --- OpenAI Chat (Company-Specific with Context) ---
router.post("/chat/openai", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // Import the search function to get relevant context
    const { semanticSearch } = await import('../services/search.js');
    const { answerWithContext } = await import('../services/ai.js');

    // Get relevant context from scraped pages
    const top = await semanticSearch(message, 5);
    const answer = await answerWithContext({ question: message, contextChunks: top });
    
    res.json({ reply: answer });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

// --- Cohere Chat ---
router.post("/chat/cohere", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const response = await cohere.chat({
      model: "command-r-plus", // or "command-r"
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.message.content[0].text });
  } catch (err) {
    console.error("Cohere error:", err);
    res.status(500).json({ error: "Cohere request failed" });
  }
});

export default router;
