import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  openaiKey: process.env.OPENAI_API_KEY,
  cohereKey: process.env.COHERE_API_KEY,
  model: process.env.MODEL || "gpt-4o-mini",
  embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
  baseUrl: process.env.BASE_URL || "https://www.hk.co",
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:8080", "http://[::1]:8080"],
  maxContextTokens: parseInt(process.env.MAX_CONTEXT_TOKENS || "7000", 10),
};
