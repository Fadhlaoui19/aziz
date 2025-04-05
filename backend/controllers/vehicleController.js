import Vehicle from '../models/Vehicle.js';

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('maintenance');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};