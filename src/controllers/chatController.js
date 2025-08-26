import { semanticSearch } from '../services/search.js';
import { answerWithContext } from '../services/ai.js';
import { extractFromWebsiteContent } from '../services/contentExtractor.js';

export async function health(req, res) {
  return res.json({ ok: true, time: new Date().toISOString() });
}

export async function chat(req, res) {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    // Step 1: Search website content first
    const top = await semanticSearch(message, 5);
    
    // Step 2: Try to extract answer directly from website content
    const directAnswer = extractFromWebsiteContent(message, top);
    
    if (directAnswer) {
      return res.json({ 
        type: 'website', 
        answer: directAnswer, 
        sources: top 
      });
    }
    
    // Step 3: If no direct website answer, use AI with context
    const answer = await answerWithContext({ question: message, contextChunks: top });
    return res.json({ type: 'ai', answer, sources: top });
    
  } catch (error) {
    console.log('Chat processing error:', error.message);
    return res.status(500).json({ 
      error: 'Unable to process your request at this time' 
    });
  }
}
