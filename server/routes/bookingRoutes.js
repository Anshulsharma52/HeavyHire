import express from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, ownerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking);

router.route('/mybookings')
  .get(protect, getMyBookings);

router.route('/owner')
  .get(protect, ownerOrAdmin, getOwnerBookings);

router.route('/:id/status')
  .put(protect, ownerOrAdmin, updateBookingStatus);

export default router;
