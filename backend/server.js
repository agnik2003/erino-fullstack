const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend Vite URL
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));  

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // For React Router (SPA), always return index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
