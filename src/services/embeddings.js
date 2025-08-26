import OpenAI from 'openai';
import { config } from '../config.js';


const openai = new OpenAI({ apiKey: config.openaiKey });


export async function embed(texts = []) {
if (!texts.length) return [];
const res = await openai.embeddings.create({
model: config.embeddingModel,
input: texts
});
return res.data.map(d => d.embedding);
}


export async function embedOne(text) {
const [vec] = await embed([text]);
return vec;
}