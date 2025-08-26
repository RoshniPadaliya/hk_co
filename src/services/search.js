import Page from '../models/Page.js';
import { embedOne } from './embeddings.js';
import { cosineSim } from '../utils/text.js';

export async function semanticSearch(query, topK = 5) {
  try {
    // Try embedding search first
    const qVec = await embedOne(query);
    const pages = await Page.find({}, { 'chunks.text': 1, 'chunks.embedding': 1, url: 1, title: 1 }).lean();

    const scored = [];
    for (const p of pages) {
      for (const ch of p.chunks || []) {
        if (!ch.embedding) continue;
        const score = cosineSim(qVec, ch.embedding);
        scored.push({ score, text: ch.text, url: p.url, title: p.title });
      }
    }
    
    if (scored.length > 0) {
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, topK);
    }
  } catch (error) {
    console.log('Embedding search failed, falling back to keyword search:', error.message);
  }

  try {
    // Fallback: enhanced keyword-based search
    const pages = await Page.find({ content: { $exists: true, $ne: '' } }).lean();
    console.log('Database pages found:', pages.length);
    pages.forEach(page => {
      console.log('Page title:', page.title);
      console.log('Content preview:', page.content ? page.content.substring(0, 100) + '...' : 'No content');
    });
    
    const scored = [];
    
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Create synonym mappings for better search
    const synonyms = {
      'sustain': ['sustainability', 'sustainable', 'environment', 'eco', 'green'],
      'project': ['initiative', 'program', 'campaign', 'effort'],
      'start': ['begin', 'launch', 'establish', 'create', 'found'],
      'leader': ['leadership', 'management', 'team', 'executive'],
      'certif': ['certification', 'certified', 'standard', 'quality'],
      'carat': ['weight', 'size'],
      'color': ['hue', 'shade'],
      'grading': ['evaluation', 'assessment'],
      'cut': ['shape', 'style'],
      'clarity': ['purity', 'transparency'],
      'mission': ['initiative', 'program', 'campaign', 'goal', 'objective'],
      '102030': ['mission 102030', 'tree plantation', 'environmental'],
      'tree': ['plantation', 'forest', 'environment', 'green'],
      'water': ['conservation', 'lake', 'river', 'resource'],
      // Enhanced leadership/founder synonyms
      'shavji': ['savji', 'savji dholakia', 'founder', 'chairman', 'padma shri'],
      'savji': ['shavji', 'savji dholakia', 'founder', 'chairman', 'padma shri'],
      'dholakia': ['savji dholakia', 'ghanshyam dholakia', 'tulsi dholakia', 'himmat dholakia', 'founder'],
      'founder': ['savji', 'shavji', 'dholakia', 'ghanshyam', 'tulsi', 'himmat', 'leadership']
    };
    
    for (const page of pages) {
      if (!page.content) continue;
      
      const contentLower = page.content.toLowerCase();
      let score = 0;
      
      // Exact phrase match (highest priority)
      if (contentLower.includes(queryLower)) {
        score += 10;
      }
      
      // Individual word matching with synonyms
      for (const word of queryWords) {
        // Check for the word itself
        if (contentLower.includes(word)) {
          score += 2;
        }
        
        // Check for synonyms
        if (synonyms[word]) {
          for (const synonym of synonyms[word]) {
            if (contentLower.includes(synonym)) {
              score += 1.5;
            }
          }
        }
      }
      
      // Bonus for title matches
      if (page.title && page.title.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      // Bonus for URL relevance
      if (page.url && page.url.toLowerCase().includes(queryLower.replace(/\s+/g, '-'))) {
        score += 2;
      }
      
      if (score > 0) {
        scored.push({
          score,
          text: page.content.substring(0, 600) + '...', // More context
          url: page.url,
          title: page.title
        });
      }
    }
    
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  } catch (error) {
    console.log('Keyword search also failed:', error.message);
    // Return empty results if both searches fail
    return [];
  }
}
