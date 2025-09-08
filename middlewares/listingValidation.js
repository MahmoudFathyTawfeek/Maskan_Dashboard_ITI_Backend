import categoryModel from "../models/categoryModel.js";
import amenityModel from "../models/amenityModel.js";

export const validateListing = async (req, res, next) => {
  const {
    title,
    descrption,
    pricePerNight,
    maxGustes,
    categoryId,
    amenitiesId,
    photos
  } = req.body;

  //  تحقق من الحقول الأساسية
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Listing title is required" });
  }

  if (!descrption || descrption.trim() === "") {
    return res.status(400).json({ message: "Listing description is required" });
  }

  if (pricePerNight === undefined || pricePerNight < 0) {
    return res.status(400).json({ message: "Price per night must be >= 0" });
  }

  if (maxGustes === undefined || maxGustes < 1) {
    return res.status(400).json({ message: "Max guests must be >= 1" });
  }

  if (!categoryId) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  //  التحقق من وجود الـ Category في DB
  const categoryExists = await categoryModel.findById(categoryId);
  if (!categoryExists) {
    return res.status(400).json({ message: "Category not found" });
  }

  //  التحقق من وجود كل Amenity في DB
  if (amenitiesId && amenitiesId.length > 0) {
    for (let amenityId of amenitiesId) {
      const amenityExists = await amenityModel.findById(amenityId);
      if (!amenityExists) {
        return res.status(400).json({ message: `Amenity not found: ${amenityId}` });
      }
    }
  }

  //  التحقق من الصور
  if (!photos || photos.length < 1) {
    return res.status(400).json({ message: "At least 5 photos are required" });
  }

  next(); // كل شيء تمام
};
