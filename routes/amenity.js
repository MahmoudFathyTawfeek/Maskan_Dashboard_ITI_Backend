import express from "express";
import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity
} from "../controllers/amenity.controller.js";

import { validateAmenity } from "../middlewares/amenityValidation.js";

const router = express.Router();

router.get("/", getAllAmenities);
router.get("/:id", getAmenityById);
router.post("/", validateAmenity, createAmenity); // إضافة التحقق
router.put("/:id", validateAmenity, updateAmenity); // إضافة التحقق
router.delete("/:id", deleteAmenity);

export default router;
