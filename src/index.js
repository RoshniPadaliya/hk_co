import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { config } from "./config.js";
import chatRoutes from "./routes/chat.js";

const app = express();

// --- Middleware ---
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.set("trust proxy", 1); // for rate-limit behind proxies

// --- CORS ---
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (config.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // max 60 requests per IP per minute
});
app.use("/api/", limiter);

// --- Routes ---
app.use("/api", chatRoutes);

// --- Health Check ---
app.get("/", (req, res) =>
  res.send("🤖 HK Webflow AI Chatbot API running...")
);

// --- Start Server & Connect to MongoDB ---
(async function start() {
  try {
    console.log("🔑 MONGO_URI from env:", config.mongoUri);

    if (!config.mongoUri) throw new Error("MONGO_URI missing in .env");

    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected");

    // Start Express server
    app.listen(config.port, () =>
      console.log(`🚀 API running on port: ${config.port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
