import express from 'express';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

import purchaseRoutes from './routes/purchaseRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/upload', uploadRoutes);

export default app;
