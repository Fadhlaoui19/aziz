import mongoose from 'mongoose';

const fuelSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
  type: { type: String, enum: ['bon', 'carte'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Fuel', fuelSchema);