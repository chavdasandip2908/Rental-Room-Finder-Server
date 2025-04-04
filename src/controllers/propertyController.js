const Property = require("../models/Property");
const PropertyRequest = require("../models/PropertyRequest");

// Create Property
exports.createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      createdBy: req.user?.id,
      owner: req.user?.id,
      galleryShow: false, // Always false on creation
      galleryShowBy: null // No approval initially
    };

    const property = new Property(propertyData);
    await property.save();
    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Properties and also get specific type properties
exports.getProperties = async (req, res) => {
  try {
    const { propertyType } = req.query;

    // Filter object
    const filter = propertyType ? { propertyType } : {};

    const properties = await Property.find(filter).populate("createdBy", "name email");

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

    if (property.createdBy.toString() !== req.user.id.toString()) {
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

    if (property.createdBy.toString() !== req.user.id.toString()) {
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

    // Property alredy approved
    if (property.galleryShow) return res.status(400).json({ message: "Property is already approved" });

    property.galleryShow = true;
    property.galleryShowBy = req.user.id;
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

    property.status = "Sold";
    await property.save();

    res.status(200).json({ message: "Property marked as sold", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buyer Request for Property
exports.requestProperty = async (req, res) => {
  try {
    const { pid } = req.params;

    // Check if request already exists
    const existingRequest = await PropertyRequest.findOne({ property: pid, buyer: req.user.id });
    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested to buy this property" });
    }

    const propertyRequest = new PropertyRequest({
      property: pid,
      buyer: req.user.id,
    });

    await propertyRequest.save();
    res.status(201).json({ message: "Property request submitted", propertyRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Buyer Requests for a Property (Owner Access)
exports.getPropertyRequests = async (req, res) => {
  try {
    const { pid } = req.params;

    const property = await Property.findById(pid);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only view requests for your properties" });
    }

    const requests = await PropertyRequest.find({ property: pid })
      .populate("buyer", "name email")
      .populate("property", "name location");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all buy requests for specific owner
exports.getOwnerPropertyRequests = async (req, res) => {
  try {
    // Find all properties created by this user (owner)
    const properties = await Property.find({ createdBy: req.user.id }).select("_id");


    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found for this user" });
    }

    // Extract all property IDs
    const propertyIds = properties.map((property) => property._id);

    // Find all requests for these properties
    const requests = await PropertyRequest.find({ property: { $in: propertyIds } })
      .populate("buyer", "name email")
      .populate("property", "title");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get all properties where the  user has sent a Buy Request
exports.getUserBuyAllProperty = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all property requests by the logged-in user
    const buyRequests = await PropertyRequest.find({ buyer: userId })
      .populate({
        path: "property",
        select: "title images price area owner",
        populate: { path: "owner", select: "name email" }
      })
      .sort({ createdAt: -1 });

    if (!buyRequests.length) {
      return res.status(404).json({ message: "No Buy Requests found!" });
    }
    // **Filter out requests where `property` is null**
    const validRequests = buyRequests.filter(request => request.property);

    // Format response with required fields
    const formattedResponse = validRequests.map(request => {
      let statusMessage = "";

      if (request.status === "pending") {
        statusMessage = "Your request is under review.";
      } else if (request.status === "rejected") {
        statusMessage = "Your request was rejected by the owner.";
      } else if (request.status === "approved" && request.property.owner) {
        statusMessage = {
          ownerName: request.property.owner.name,
          ownerEmail: request.property.owner.email,
          message: "Your request was approved by the owner.",
        };
      }

      return {
        id: request.property._id,
        title: request.property.title,
        image: request.property.images.length > 0 ? request.property.images[0] : null,
        price: request.property.price,
        size: request.property.area,
        status: request.status,
        statusMessage,
      };
    });

    if (!formattedResponse.length) {
      return res.status(404).json({ message: "No valid Buy Requests found!" });
    }

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching buyer requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




// Get Buyer Requests for a Property (Owner Access)
exports.getSpecificUserProperty = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found for this user." });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Approve Buy Request (Owner Access)
exports.approvePropertyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PropertyRequest.findById(requestId).populate("property");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.property.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only approve requests for your properties" });
    }

    request.status = "approved";
    await request.save();

    res.status(200).json({ message: "Property request approved", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Buy Request (Owner Access)
exports.rejectPropertyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PropertyRequest.findById(requestId).populate("property");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.property.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only reject requests for your properties" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Property request rejected", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Properties by Text Query
exports.searchProperties = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const properties = await Property.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
