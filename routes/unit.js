// routes/unit.js
import express from "express";
import * as unitController from "../controllers/unit.controller.js";

const router = express.Router();

router.get("/", unitController.getAllUnits);
router.get("/:id", unitController.getUnitById);
router.post("/", unitController.createUnit);
router.put("/:id", unitController.updateUnit);
router.delete("/:id", unitController.deleteUnit);

export default router;
