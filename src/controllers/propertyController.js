const Property = require("../models/Property");

// Create Property
exports.createProperty = async (req, res) => {
  try {
    const property = new Property({ ...req.body, createdBy: req.user._id });
    await property.save();
    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("createdBy", "name email");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Property
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("createdBy", "name email");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own properties" });
    }

    Object.assign(property, req.body);
    await property.save();
    res.status(200).json({ message: "Property updated successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own properties" });
    }

    await property.deleteOne();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Gallery Properties
exports.getGalleryProperties = async (req, res) => {
  try {
    const properties = await Property.find({ galleryShow: true });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Property for Gallery
exports.approveGallery = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.galleryShow = true;
    property.galleryShowBy = req.user._id;
    await property.save();

    res.status(200).json({ message: "Property approved for gallery", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Property as Sold
exports.markPropertySold = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = "rented";
    await property.save();

    res.status(200).json({ message: "Property marked as sold", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
