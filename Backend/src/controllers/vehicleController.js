import {
  getAllVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../services/vehicleService.js';

/**
 * GET /api/vehicles
 */
export const getAll = async (req, res) => {
  try {
    const vehicles = await getAllVehicles();
    return res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * GET /api/vehicles/search
 */
export const search = async (req, res) => {
  try {
    const vehicles = await searchVehicles(req.query);
    return res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * POST /api/vehicles
 */
export const create = async (req, res) => {
  try {
    const { make, model, category, price, quantity, imageUrl } = req.body;

    if (!make || !model || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Make, model, and price are required',
      });
    }

    const vehicle = await createVehicle({ make, model, category, price, quantity, imageUrl });
    return res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * PUT /api/vehicles/:id
 */
export const update = async (req, res) => {
  try {
    const vehicle = await updateVehicle(req.params.id, req.body);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    return res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * DELETE /api/vehicles/:id
 */
export const remove = async (req, res) => {
  try {
    const vehicle = await deleteVehicle(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * POST /api/vehicles/:id/purchase
 */
export const purchase = async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = req.body?.quantity ? Number(req.body.quantity) : 1;
    const userId = req.user.id;

    const vehicle = await purchaseVehicle(id, userId, quantity);
    return res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    if (
      error.status === 400 ||
      (error.message && error.message.match(/out of stock|insufficient|quantity/i))
    ) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Vehicle is out of stock',
      });
    }
    if (error.status === 404 || error.message === 'Vehicle not found') {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * POST /api/vehicles/:id/restock
 */
export const restock = async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = req.body?.quantity !== undefined ? Number(req.body.quantity) : 1;

    const vehicle = await restockVehicle(id, quantity, req.body);
    return res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    if (error.status === 400 || error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.status === 404 || error.message === 'Vehicle not found') {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

