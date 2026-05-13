import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { getIO } from '../socket.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, bookingDate, endDate, duration, startTime, endTime } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const booking = new Booking({
      userId: req.user._id,
      vehicleId,
      bookingDate,
      endDate,
      duration,
      startTime,
      endTime,
      status: 'pending',
    });

    const createdBooking = await booking.save();
    
    // Populate necessary fields for the real-time event
    const populatedBooking = await Booking.findById(createdBooking._id)
      .populate('userId', 'name phone email')
      .populate('vehicleId', 'vehicleName ownerId');

    // Emit event to admins and the specific owner
    const io = getIO();
    io.emit('newBooking', populatedBooking);
    
    // If using rooms, you could also emit specifically to the owner:
    // io.to(populatedBooking.vehicleId.ownerId.toString()).emit('newBooking', populatedBooking);

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'vehicleId',
        select: 'vehicleName images pricePerHour pricePerDay ownerId',
        populate: {
          path: 'ownerId',
          select: 'name email phone'
        }
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for owner's vehicles
// @route   GET /api/bookings/owner
// @access  Private (Owner/Admin)
export const getOwnerBookings = async (req, res) => {
  try {
    // Find all vehicles owned by this user
    const vehicles = await Vehicle.find({ ownerId: req.user._id }).select('_id');
    const vehicleIds = vehicles.map(v => v._id);

    const bookings = await Booking.find({ vehicleId: { $in: vehicleIds } })
      .populate('userId', 'name phone email')
      .populate('vehicleId', 'vehicleName');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner/Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicleId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is the owner of the vehicle, an admin, or the customer cancelling their own booking
    const isOwner = booking.vehicleId.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isCustomerCancelling = booking.userId.toString() === req.user._id.toString() && status === 'cancelled';

    if (!isOwner && !isAdmin && !isCustomerCancelling) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    // Use findByIdAndUpdate to avoid CastError from populated vehicleId on save
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // Emit event to user (and admins) that the status changed
    const io = getIO();
    io.emit('bookingStatusUpdate', updatedBooking);

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
