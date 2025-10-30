import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,             
    trim: true,                  
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    default: "N/A",
  },
  description: {
    type: String,
    default: "",
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",             
    },
  ],
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",                
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);


export default Hospital;
