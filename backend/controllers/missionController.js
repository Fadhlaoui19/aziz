import Mission from '../models/Mission.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

export const getMissions = async (req, res) => {
  try {
    const missions = await Mission.find()
      .populate('vehicle', 'registration brand model')
      .populate('driver', 'email role');
    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMission = async (req, res) => {
  try {
    const { vehicle, driver, startDate, endDate } = req.body;
    
    // Check vehicle and driver existence
    const [vehicleExists, driverExists] = await Promise.all([
      Vehicle.findById(vehicle),
      User.findById(driver)
    ]);

    if (!vehicleExists || !driverExists) {
      return res.status(400).json({ message: 'Invalid vehicle or driver' });
    }

    // Check date conflicts
    const overlappingMission = await Mission.findOne({
      vehicle,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
        { startDate: { $gte: startDate, $lte: endDate } }
      ]
    });

    if (overlappingMission) {
      return res.status(400).json({ message: 'Vehicle already assigned for this period' });
    }

    const newMission = new Mission(req.body);
    await newMission.save();
    res.status(201).json(newMission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMissionStatus = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(mission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMission = async (req, res) => {
  try {
    await Mission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};