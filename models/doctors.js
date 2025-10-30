import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  speciality: String,
  experience: String,
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  phone: String,
  email: String,
});

export default mongoose.model("Doctor", doctorSchema);
