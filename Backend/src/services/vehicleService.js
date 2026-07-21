import Vehicle from '../models/vehicleModel.js';

/**
 * Get all vehicles.
 */
export const getAllVehicles = async () => {
  return Vehicle.find({});
};

/**
 * Search vehicles with dynamic filters.
 * Supports: make, model, category, minPrice, maxPrice.
 */
export const searchVehicles = async (query) => {
  const filter = {};

  if (query.make) {
    filter.make = { $regex: query.make, $options: 'i' };
  }
  if (query.model) {
    filter.model = { $regex: query.model, $options: 'i' };
  }
  if (query.category) {
    filter.category = { $regex: query.category, $options: 'i' };
  }
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return Vehicle.find(filter);
};

/**
 * Create a new vehicle.
 */
export const createVehicle = async (vehicleData) => {
  return Vehicle.create(vehicleData);
};

/**
 * Update a vehicle by ID.
 * @returns {Promise<object|null>} Updated vehicle or null if not found.
 */
export const updateVehicle = async (id, updateData) => {
  return Vehicle.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete a vehicle by ID.
 * @returns {Promise<object|null>} Deleted vehicle or null if not found.
 */
export const deleteVehicle = async (id) => {
  return Vehicle.findByIdAndDelete(id);
};
