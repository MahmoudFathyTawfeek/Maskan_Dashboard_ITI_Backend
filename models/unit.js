// models/Unit.js
import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  location: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  imageUrl: {
    type: String
  },

  isAvailable: {
    type: Boolean,
    required: true
  }

}, {
  timestamps: true // optional: adds createdAt and updatedAt
});

const Unit = mongoose.model("Unit", unitSchema);
export default Unit; 
