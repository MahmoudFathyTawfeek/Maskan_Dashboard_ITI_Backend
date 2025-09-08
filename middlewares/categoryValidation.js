import categoryModel from "../models/categoryModel.js";

export const validateCategory = async (req, res, next) => {
  const { name, arName } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Category name (English) is required" });
  }

  if (!arName || arName.trim() === "") {
    return res.status(400).json({ message: "Category name (Arabic) is required" });
  }

  try {
    //  تحقق من name (English)
    const existingName = await categoryModel.findOne({ name: name.trim() });
    if (existingName) {
      if (req.method === "POST" || existingName._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "This English category already exists" });
      }
    }

    //  تحقق من arName (Arabic)
    const existingArName = await categoryModel.findOne({ arName: arName.trim() });
    if (existingArName) {
      if (req.method === "POST" || existingArName._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "This Arabic category already exists" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
