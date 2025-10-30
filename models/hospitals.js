import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  contact: String,
  website: String,
  speciality: String,
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }]
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
