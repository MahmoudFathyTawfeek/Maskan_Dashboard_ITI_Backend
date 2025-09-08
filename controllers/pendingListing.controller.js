import Listing from '../models/listing.js';

// جلب كل الليستنجز اللي isApproved = false
export const getPendingListings = async (req, res) => {
  try {
    const pendingListings = await Listing.find({ isApproved: false })
      .populate('host', 'userName email')      // populate host info
      .populate('categoryId', 'name')          // populate category name
      .populate('amenitiesId', 'name');       // populate amenities names
    res.json(pendingListings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listings', error: err.message });
  }
};

// اعتماد listing معين (isApproved = true)
export const approveListing = async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Error approving listing', error: err.message });
  }
};

// رفض listing مع سبب
export const rejectListing = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, rejectionReason, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting listing', error: err.message });
  }
};
