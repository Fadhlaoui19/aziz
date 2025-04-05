import express from 'express';
import { 
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';
import { roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.get('/', 
  roleMiddleware(['admin', 'manager', 'driver']), 
  getVehicles
);

router.post('/', 
  roleMiddleware(['admin', 'manager']),
  createVehicle
);

router.put('/:id', 
  roleMiddleware(['admin', 'manager']),
  updateVehicle
);

router.delete('/:id', 
  roleMiddleware(['admin']),
  deleteVehicle
);

export default router;