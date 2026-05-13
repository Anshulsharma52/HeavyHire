import Vehicle from '../models/Vehicle.js';

// @desc    Get all vehicles (with filters)
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = async (req, res) => {
  try {
    const { category, location } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const vehicles = await Vehicle.find(query).populate('ownerId', 'name phone');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('ownerId', 'name phone');
    
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vehicle listing
// @route   POST /api/vehicles
// @access  Private (Owner/Admin)
export const createVehicle = async (req, res) => {
  try {
    const {
      vehicleName,
      category,
      pricePerHour,
      pricePerDay,
      location,
      description,
      operatorIncluded,
      fuelIncluded
    } = req.body;

    const images = req.files ? req.files.map(file => {
      return file.path.startsWith('http') ? file.path : `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }) : [];

    if (images.length === 0) {
       return res.status(400).json({ message: 'At least one image is required' });
    }

    const vehicle = new Vehicle({
      ownerId: req.user._id,
      vehicleName,
      category,
      pricePerHour,
      pricePerDay,
      location,
      description,
      operatorIncluded,
      fuelIncluded,
      images,
    });

    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Owner/Admin)
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      if (vehicle.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this vehicle' });
      }

      vehicle.vehicleName = req.body.vehicleName || vehicle.vehicleName;
      vehicle.category = req.body.category || vehicle.category;
      vehicle.pricePerHour = req.body.pricePerHour || vehicle.pricePerHour;
      vehicle.pricePerDay = req.body.pricePerDay || vehicle.pricePerDay;
      vehicle.location = req.body.location || vehicle.location;
      vehicle.description = req.body.description || vehicle.description;
      vehicle.availability = req.body.availability !== undefined ? req.body.availability : vehicle.availability;
      
      if (req.files && req.files.length > 0) {
        vehicle.images = req.files.map(file => {
          return file.path.startsWith('http') ? file.path : `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        });
      }
      
      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Owner/Admin)
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
       if (vehicle.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this vehicle' });
      }
      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
