// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import hospitalRoutes from "./routes/hospitalRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session (used by admin auth middleware)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Connect DB (config/db.js)
await (async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connect failed in server.js:", err);
    process.exit(1);
  }
})();

// Mount routers at base paths for clarity
app.use("/hospitals", hospitalRoutes);
app.use("/doctors", doctorRoutes);
app.use("/admin", adminRoutes);

// Home page (index view)
app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 3000;
import mongoose from "mongoose";
console.log("Connected DB:", mongoose.connection.name);
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
