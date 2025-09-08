import categoryModel from "../models/categoryModel.js";
import listModel from "../models/listing.js";

//  Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, arName } = req.body;
    const newCategory = await categoryModel.create({ name, arName });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, arName } = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name, arName },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Delete category
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get categories with count of listings
export const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await categoryModel.aggregate([
      {
        $lookup: {
          from: "lists", // اسم الكولكشن الفعلي في MongoDB (listModel -> lists)
          localField: "_id",
          foreignField: "categoryId",
          as: "listings",
        },
      },
      {
        $project: {
          name: 1,
          arName: 1,
          count: { $size: "$listings" }, // عدد الإعلانات في كل كاتيجوري
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


