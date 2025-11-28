
import express from "express";
import Admin from "../models/admin.js";
import Hospital from "../models/hospitals.js";
import Doctor from "../models/doctors.js";

const router = express.Router();

// add cache-control headers for admin routes to prevent browser caching
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});


function isAuthenticated(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized: Please log in first" });
}


// One time Admin Registration Route, but made it secure so it needs login before adding new admin 
router.post("/register", isAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).send("Admin already exists!");
    }

    const newAdmin = await Admin.create({ username, password });
    return res.status(201).send(`✅ Admin '${newAdmin.username}' created successfully.`);
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).send("❌ Failed to create admin");
  }
});



router.get("/login", (req, res) => {
  res.json({ message: "Send POST request to /api/admin/login with username and password" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.admin = admin.username;
    res.json({ message: "Login successful",admin: admin.username });

    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Server error during login");
  }
});


// Check if admin session is active
router.get("/check-session", (req, res) => {
  if (req.session && req.session.admin) {
    res.json({ loggedIn: true, admin: req.session.admin });
  } else {
    res.json({ loggedIn: false });
  }
});



router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {

    const hospitals = await Hospital.find();
    const doctors = await Doctor.find().populate("hospital", "name");

    const successMessage = req.session.successMessage;
    delete req.session.successMessage; 

    res.json({
      admin: req.session.admin,
      hospitals,
      doctors,
      successMessage: successMessage || null,
    });
  } catch (error) {
    console.error("Dashboard load error:", error);
    return res.status(500).send("Server error loading dashboard");
  }
});


router.post("/add-hospital", isAuthenticated, async (req, res) => {
  try {
    const { name, address, city, state, description, contact } = req.body;

    await Hospital.create({ name, address, city, state, description, contact });

    req.session.successMessage = "✅ Hospital added successfully!";
    return res.status(201).json({ message: "Hospital added successfully", Hospital });

  } catch (error) {
    console.error("Error adding hospital:", error);
    return res.status(500).send("Error adding hospital");
  }
});



router.post("/add-doctor", isAuthenticated, async (req, res) => {
  try {
    const { name, specializations, experience, hospital } = req.body;

    const specializationArray = Array.isArray(specializations)
      ? specializations
      : specializations.split(",").map(s => s.trim());

    const doctor = await Doctor.create({
      name,
      specializations: specializationArray,
      experience,
      hospital,
    });

    if (hospital) {
      await Hospital.findByIdAndUpdate(hospital, { $push: { doctors: doctor._id } });
    }

    req.session.successMessage = "✅ Doctor added successfully!";
    return res.status(201).json({ message: "✅ Doctor added successfully!" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).send("Error adding doctor");
  }
});




router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout Succesfull" });
  });
});

router.use((req, res) => res.status(404).send("404 - Page not found"));

export default router;
