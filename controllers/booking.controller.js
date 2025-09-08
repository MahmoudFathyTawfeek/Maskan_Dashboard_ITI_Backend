import bookingModel from '../models/booking.js';

/**
 *  Get all bookings (optionally by guest or listing)
 */
export const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.guest) filter.guest = req.query.guest;
    if (req.query.listing) filter.listing = req.query.listing;

    const bookings = await bookingModel
      .find(filter)
      .populate('guest')
      .populate('listing');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

/**
 *  Get booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate('guest')
      .populate('listing');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

/**
 *  Create new booking
 */
export const createBooking = async (req, res) => {
  try {
    const newBooking = new bookingModel(req.body);
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
};

/**
 *  Update booking
 */
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
};

/**
 *  Delete booking
 */
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await bookingModel.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};
