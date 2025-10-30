import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,       
    trim: true,           
  },

  specializations: {
    type: [String],
    required: true,
    trim: true,
  },

  experience: {
    type: Number,
    default: 0,           
  },

  hospital: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: "Hospital",                        
    required: true,                         
  },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",                
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
