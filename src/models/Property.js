const mongoose = require("mongoose");

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

module.exports = mongoose.model("Property", propertySchema);
