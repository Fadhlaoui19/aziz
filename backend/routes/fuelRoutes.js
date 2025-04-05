import express from 'express';
import {
  getFuelEntries,
  createFuelEntry,
  getFuelReport
} from '../controllers/fuelController.js';

const router = express.Router();

router.get('/', getFuelEntries);
router.post('/', createFuelEntry);
router.get('/report', getFuelReport);

export default router;