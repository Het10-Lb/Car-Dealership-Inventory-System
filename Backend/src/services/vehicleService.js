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

/**
 * Purchase a vehicle by ID using atomic operators to prevent race conditions.
 * Decrements quantity by count if stock is available.
 * @param {string} id - Vehicle ID
 * @param {number} [count=1] - Number of vehicles to purchase
 * @returns {Promise<object>} Updated vehicle
 */
export const purchaseVehicle = async (id, count = 1) => {
  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: id, quantity: { $gte: count } },
    { $inc: { quantity: -count } },
    { returnDocument: 'after' }
  );

  if (!updatedVehicle) {
    const existingVehicle = await Vehicle.findById(id);
    if (!existingVehicle) {
      const error = new Error('Vehicle not found');
      error.status = 404;
      throw error;
    }
    if (existingVehicle.quantity < count) {
      const error = new Error('Vehicle is out of stock / insufficient quantity');
      error.status = 400;
      throw error;
    }
  }

  return updatedVehicle;
};

/**
 * Restock a vehicle by ID.
 * Increments quantity by count. If vehicle does not exist and vehicle data is provided, creates it.
 * @param {string} id - Vehicle ID
 * @param {number} [count=1] - Number of vehicles to add
 * @param {object} [vehicleData] - Optional details to create new vehicle if not found
 * @returns {Promise<object>} Updated or created vehicle
 */
export const restockVehicle = async (id, count = 1, vehicleData = {}) => {
  if (count <= 0) {
    const error = new Error('Restock quantity must be greater than zero');
    error.status = 400;
    throw error;
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { $inc: { quantity: count } },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedVehicle) {
    if (vehicleData && vehicleData.make && vehicleData.model && vehicleData.price !== undefined) {
      return Vehicle.create({
        _id: id,
        ...vehicleData,
        quantity: count,
      });
    }
    const error = new Error('Vehicle not found');
    error.status = 404;
    throw error;
  }

  return updatedVehicle;
};

