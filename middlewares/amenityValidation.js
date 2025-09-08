import amenityModel from "../models/amenityModel.js";

//  التحقق قبل إنشاء أو تعديل الـ Amenity
export const validateAmenity = async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Amenity name is required" });
  }

  try {
    // التأكد أن الاسم فريد (لإنشاء جديد)
    const existingAmenity = await amenityModel.findOne({ name: name.trim() });
    
    // إذا العملية POST أو الاسم غير مطابق للـ ID الحالي في PUT
    if (existingAmenity) {
      if (req.method === "POST" || existingAmenity._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "This Amenity already exists" });
      }
    }

    next(); // إذا كل شيء تمام، استمر للكونترولر
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
