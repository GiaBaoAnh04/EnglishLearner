// import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes";

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use("/api/auth", authRoutes);

// export default app;

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
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
