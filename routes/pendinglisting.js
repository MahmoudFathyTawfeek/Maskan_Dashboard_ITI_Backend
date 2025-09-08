import express from 'express';
import { getPendingListings, approveListing, rejectListing } from '../controllers/pendingListing.controller.js';

const router = express.Router();

// جلب كل الـ pending listings
router.get('/pending', getPendingListings);

// اعتماد listing
router.put('/:id/approve', approveListing);

// رفض listing
router.put('/:id/reject', rejectListing);

export default router;
