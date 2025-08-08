import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import idiomRoutes from "./routes/idiom.routes";
import commentRoutes from "./routes/comment.routes";
import replyRoutes from "./routes/reply.routes";
import { connectDB } from "./config/db";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/idiom", idiomRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/reply", replyRoutes);

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
