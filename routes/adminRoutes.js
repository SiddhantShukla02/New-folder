// routes/adminRoutes.js
import express from "express";
import Admin from "../models/admin.js";
import Hospital from "../models/hospitals.js";
import Doctor from "../models/doctors.js";

const router = express.Router();

// Simple middleware to protect admin routes
const isAuth = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  res.redirect("/admin/login");
};


router.get("/", (req, res) => {
  // res.render("admin_login", { error: null });
  res.redirect("/admin/login");
});
// GET /admin/login
router.get("/login", (req, res) => {
  res.render("admin_login", { error: null });
});

// POST /admin/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;


  if (username === process.env.ADMIN_USER || username === "admin") {
    if (password === process.env.ADMIN_PASS || password === "1234") {
      req.session.admin = username;
      return res.redirect("/admin/dashboard");
    }
  }


  res.render("admin_login", { error: "Invalid credentials" });
});

// GET /admin/dashboard
router.get("/dashboard", isAuth, async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    const doctors = await Doctor.find().populate("hospital", "name");
    res.render("admin", { hospitals, doctors });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /admin/hospitals  (from admin form)
router.post("/hospitals", isAuth, async (req, res) => {
  try {
    const { name, location, description, city, contact } = req.body;
    const h = await Hospital.create({ name, location, description, city, contact });
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /admin/doctors  (from admin form)
router.post("/doctors", isAuth, async (req, res) => {
  try {
    const { name, specialization, experience, hospital } = req.body; // note: 'hospital' is hospital id from form
    const d = await Doctor.create({ name, specialization, experience, hospital });

    
    if (hospital) {
      await Hospital.findByIdAndUpdate(hospital, { $push: { doctors: d._id } });
    }

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /admin/logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

export default router;
