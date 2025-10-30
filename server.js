
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";


import hospitalRoutes from "./routes/hospitalRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors({
  origin: "https://testing-health-portal.netlify.app/", 
  credentials: true 
}));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, //true for https
      sameSite: "lax", 
      maxAge: 1000 * 60 * 60, 
    },
  })
);

(async () => {
  try {
    await connectDB();
    
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
})();

app.use("/hospitals", hospitalRoutes);
app.use("/doctors", doctorRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hospital Management API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
