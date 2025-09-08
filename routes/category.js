import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithCount 
} from "../controllers/category.controller.js";

import { validateCategory } from "../middlewares/categoryValidation.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", validateCategory, createCategory);
router.get("/with-count", getCategoriesWithCount);
router.get("/:id", getCategoryById);
router.post("/", validateCategory, createCategory);
router.put("/:id", validateCategory, updateCategory);
router.delete("/:id", deleteCategory);



export default router;
