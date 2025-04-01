const mongoose = require("mongoose");

<<<<<<< HEAD
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  area: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  images: { type: [String], required: true },
  amenities: { type: [String], required: true },
  galleryShow: { type: Boolean, default: false }, // Default: hidden
  galleryShowBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Master admin who approves
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyType: { type: String, required: true },
  status: { type: String, enum: ["Available", "Sold", "Pending"], default: "Available" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },

});
=======
const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    photo: [{ type: String }], // Array of images
    value: { type: Number, required: true }, // Rent price
    size: { type: Number, required: true }, // Square feet
    location: { type: String, required: true },
    amenities: [{ type: String }], // Example: ["WiFi", "Parking"]
    status: { type: String, enum: ["available", "rented", "pending"], default: "available" },
    galleryShow: { type: Boolean, default: false },
    galleryShowBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
>>>>>>> 294043b (add payment gatway)

module.exports = mongoose.model("Property", propertySchema);
