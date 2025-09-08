import amenityModel from "../models/amenityModel.js";

//  Get all amenities
export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await amenityModel.find();
    res.status(200).json(amenities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get single amenity by ID
export const getAmenityById = async (req, res) => {
  try {
    const amenity = await amenityModel.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    res.status(200).json(amenity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Create new amenity
export const createAmenity = async (req, res) => {
  try {
    const newAmenity = await amenityModel.create({
      name: req.body.name,
      arName: req.body.arName,  //  مهم جداً
      icon: req.body.icon
    });
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//  Update amenity
export const updateAmenity = async (req, res) => {
  try {
    const updatedAmenity = await amenityModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, arName: req.body.arName, icon: req.body.icon }, // 
      { new: true, runValidators: true }
    );
    if (!updatedAmenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    res.status(200).json(updatedAmenity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//  Delete amenity
export const deleteAmenity = async (req, res) => {
  try {
    const deletedAmenity = await amenityModel.findByIdAndDelete(req.params.id);
    if (!deletedAmenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }
    res.status(200).json({ message: "Amenity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
