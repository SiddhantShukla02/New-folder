import express from "express";
import Admin from "../models/admin.js";
import Doctor from "../models/doctors.js";
import Hospital from "../models/hospitals.js";

const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.session.admin) return next();
  res.redirect("/admin/login");
};


//admin login
router.get("/login", (req, res) => res.render("admin_login"));



router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    req.session.admin = admin;
    res.redirect("/admin");
  } else {
    res.send("Invalid credentials");
  }
});

router.get("/admin/dashboard", isAuth, async (req, res) => {
  const hospitals = await Hospital.find();
  const doctors = await Doctor.find().populate("hospital");
  res.render("admin", { hospitals, doctors });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});



router.post("/add-hospital", isAuth, async (req, res) => {
  const { name, location, description } = req.body;
  await Hospital.create({ name, location, description });
  res.redirect("/admin/dashboard");
});

router.post("/add-doctor", isAuth, async (req, res) => {
  const { name, specialization, experience, hospitalId } = req.body;
  const doctor = await Doctor.create({ name, specialization, experience, hospital: hospitalId });
  await Hospital.findByIdAndUpdate(hospitalId, { $push: { doctors: doctor._id } });
  res.redirect("/admin/dashboard");
});

export default router;
