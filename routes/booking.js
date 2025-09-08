import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller.js';

const router = express.Router();

/**
 *  Get all bookings (optional filter by guest or listing)
 *  Create booking
 */
router.route('/')
  .get(getAllBookings)     // GET /api/bookings
  .post(createBooking);    // POST /api/bookings

/**
 *  Get booking by ID
 *  Update booking
 *  Delete booking
 */
router.route('/:id')
  .get(getBookingById)     // GET /api/bookings/:id
  .put(updateBooking)      // PUT /api/bookings/:id
  .delete(deleteBooking);  // DELETE /api/bookings/:id

export default router;
