import express from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  updateApprovalStatus,
  deleteListing,
  getPendingListings ,
  getAmenitiesDistribution
} from "../controllers/listing.controller.js";

import { validateListing } from "../middlewares/listingValidation.js";

const router = express.Router();

// GET all listings + POST create listing
router.route("/")
  .get(getAllListings)
  .post(validateListing, createListing);

  // GET pending listings
router.get("/pending", getPendingListings);
// GET, PUT, DELETE by ID
router.route("/:id")
  .get(getListingById)
  .put(validateListing, updateListing)
  .delete(deleteListing);

router.get("/distribution/amenities", getAmenitiesDistribution);

// PATCH update approval status
router.patch("/:id/approval", updateApprovalStatus);

export default router;



