import express from 'express';
import { createReview, getVehicleReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/:vehicleId')
  .get(getVehicleReviews);

export default router;
