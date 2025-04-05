import Fuel from '../models/Fuel.js';
import Vehicle from '../models/Vehicle.js';
import Mission from '../models/Mission.js';

export const getFuelEntries = async (req, res) => {
  try {
    const fuelEntries = await Fuel.find()
      .populate('vehicle', 'registration brand')
      .populate('mission', 'startDate endDate');
    res.json(fuelEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFuelEntry = async (req, res) => {
  try {
    const { vehicle, mission, type, quantity } = req.body;
    
    // Validate vehicle exists
    const vehicleExists = await Vehicle.findById(vehicle);
    if (!vehicleExists) {
      return res.status(400).json({ message: 'Invalid vehicle' });
    }

    // Validate mission if provided
    if (mission) {
      const missionExists = await Mission.findById(mission);
      if (!missionExists) {
        return res.status(400).json({ message: 'Invalid mission' });
      }
    }

    const newFuelEntry = new Fuel({
      vehicle,
      mission: mission || null,
      type,
      quantity
    });

    await newFuelEntry.save();
    res.status(201).json(newFuelEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFuelReport = async (req, res) => {
  try {
    const { period, vehicleId } = req.query;
    
    const match = {};
    if (vehicleId) match.vehicle = vehicleId;
    
    if (period) {
      const dateFilter = new Date();
      switch (period) {
        case 'month':
          dateFilter.setMonth(dateFilter.getMonth() - 1);
          break;
        case 'year':
          dateFilter.setFullYear(dateFilter.getFullYear() - 1);
          break;
        default: // week
          dateFilter.setDate(dateFilter.getDate() - 7);
      }
      match.date = { $gte: dateFilter };
    }

    const report = await Fuel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$vehicle",
          totalFuel: { $sum: "$quantity" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "_id",
          as: "vehicleDetails"
        }
      },
      { $unwind: "$vehicleDetails" }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};