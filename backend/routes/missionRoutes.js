import express from 'express';
import {
  getMissions,
  createMission,
  updateMissionStatus,
  deleteMission
} from '../controllers/missionController.js';

const router = express.Router();

router.get('/', getMissions);
router.post('/', createMission);
router.put('/:id/status', updateMissionStatus);
router.delete('/:id', deleteMission);

export default router;