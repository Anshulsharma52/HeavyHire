import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Create a review for a vehicle
// @route   POST /api/reviews
// @access  Private (User)
export const createReview = async (req, res) => {
  try {
    const { vehicleId, rating, comment } = req.body;

    // Check if user has completed a booking for this vehicle
    const hasBooked = await Booking.findOne({
      userId: req.user._id,
      vehicleId: vehicleId,
      status: 'completed'
    });

    if (!hasBooked) {
      return res.status(400).json({ message: 'You can only review vehicles you have rented and completed.' });
    }

    // Check if review already exists
    const alreadyReviewed = await Review.findOne({
      userId: req.user._id,
      vehicleId: vehicleId
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this vehicle' });
    }

    const review = new Review({
      userId: req.user._id,
      vehicleId,
      rating: Number(rating),
      comment
    });

    await review.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a vehicle
// @route   GET /api/reviews/:vehicleId
// @access  Public
export const getVehicleReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vehicleId: req.params.vehicleId }).populate('userId', 'name profileImage');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
