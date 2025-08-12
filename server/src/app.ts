import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import idiomRoutes from "./routes/idiom.routes";
import commentRoutes from "./routes/comment.routes";
import replyRoutes from "./routes/reply.routes";
import userRoutes from "./routes/user.routes";
import aiRoutes from "./routes/ai.routes";
import { connectDB } from "./config/db";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://english-learner-8j293c9vc-giabaoanhs-projects.vercel.app",
      "http://localhost:3000", // cho development
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/idiom", idiomRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/reply", replyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
