import listModel from "../models/listing.js";

/**
 *  Helper لتحويل location string إلى object
 */
const parseLocation = (location) => ({
  address: location || "",
  coordinates: {
    type: "Point",
    coordinates: [0, 0] // لو عندك longitude/latitude حقيقي ممكن تحطه هنا
  }
});

/**
 *  Get all listings (with optional isApproved filter)
 */
export const getAllListings = async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};

    if (approved !== undefined) {
      filter.isApproved = approved === "true";
    }

    const listings = await listModel
      .find(filter)
      .populate("host")
      .populate("categoryId")
      .populate("amenitiesId");

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error: error.message });
  }
};

/**
 *  Get all pending listings (isApproved = false)
 */
export const getPendingListings = async (req, res) => {
  try {
    const listings = await listModel
      .find({ isApproved: false })
      .populate("host")
      .populate("categoryId")
      .populate("amenitiesId");

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending listings", error: error.message });
  }
};

/**
 *  Get listing by ID
 */
export const getListingById = async (req, res) => {
  try {
    const listing = await listModel
      .findById(req.params.id)
      .populate("host")
      .populate("categoryId")
      .populate("amenitiesId");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error: error.message });
  }
};

/**
 *  Create new listing
 */
export const createListing = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      location: {
        ...req.body.location,
        address:
          typeof req.body.location.address === "object"
            ? JSON.stringify(req.body.location.address)
            : req.body.location.address,
      },
      maxGustes: req.body.maxGuests || req.body.maxGustes,
    };

    // إنشاء listing جديد
    const newListing = new listModel(payload);
    const savedListing = await newListing.save();

    // نعمل findById + populate بعد الحفظ
    const populatedListing = await listModel.findById(savedListing._id)
      .populate("host")
      .populate("categoryId")
      .populate("amenitiesId");

    res.status(201).json(populatedListing);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating listing", error: error.message });
  }
};

/**
 *  Update listing
 */
export const updateListing = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      location: req.body.location ? parseLocation(req.body.location) : undefined,
      maxGustes: req.body.maxGuests || req.body.maxGustes
    };

    const updatedListing = await listModel.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    )
    .populate("host")
    .populate("categoryId")
    .populate("amenitiesId");

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: "Error updating listing", error: error.message });
  }
};

/**
 *  Update approval status only
 */
export const updateApprovalStatus = async (req, res) => {
  try {
    const { approved } = req.body;

    if (approved === undefined) {
      return res.status(400).json({ message: "approved field is required" });
    }

    const listing = await listModel.findByIdAndUpdate(
      req.params.id,
      { isApproved: approved },
      { new: true }
    )
    .populate("host")
    .populate("categoryId")
    .populate("amenitiesId");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      message: `Listing approval status updated to ${approved}`,
      listing,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error: error.message });
  }
};

/**
 *  Delete listing
 */
export const deleteListing = async (req, res) => {
  try {
    const deletedListing = await listModel.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error: error.message });
  }
};

/**
 *  Get amenities distribution
 */
export const getAmenitiesDistribution = async (req, res) => {
  try {
    const result = await listModel.aggregate([
      { $unwind: "$amenitiesId" },
      { $group: { _id: "$amenitiesId", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "amenities",
          localField: "_id",
          foreignField: "_id",
          as: "amenity"
        }
      },
      { $unwind: "$amenity" },
      {
        $project: {
          _id: 0,
          amenityName: "$amenity.name",
          count: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching amenities distribution", error: error.message });
  }
};
