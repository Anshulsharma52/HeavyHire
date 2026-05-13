import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  vehicleName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Truck', 'JCB', 'Tractor', 'Dumper', 'Crane', 'Trolley'],
  },
  pricePerHour: {
    type: Number,
  },
  pricePerDay: {
    type: Number,
  },
  location: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    }
  ],
  description: {
    type: String,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  operatorIncluded: {
    type: Boolean,
    default: false,
  },
  fuelIncluded: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
