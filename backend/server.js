import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { authMiddleware, roleMiddleware } from './middleware/auth.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import fuelRoutes from './routes/fuelRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/vehicles', authMiddleware, vehicleRoutes);
app.use('/api/missions', authMiddleware, missionRoutes);
app.use('/api/fuel', authMiddleware, fuelRoutes);

// Admin-only example route
app.get('/api/admin/stats', 
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    res.json({ message: 'Admin statistics' });
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));