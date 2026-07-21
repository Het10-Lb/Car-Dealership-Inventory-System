import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);

export default app;
