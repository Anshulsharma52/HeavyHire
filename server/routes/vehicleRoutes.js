import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { protect, ownerOrAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVehicles)
  .post(protect, ownerOrAdmin, upload.array('images', 5), createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, ownerOrAdmin, upload.array('images', 5), updateVehicle)
  .delete(protect, ownerOrAdmin, deleteVehicle);

export default router;
