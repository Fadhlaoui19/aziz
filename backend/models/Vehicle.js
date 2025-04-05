import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  registration: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, enum: ['mission', 'responsable'], required: true },
  maintenance: [{
    date: { type: Date, default: Date.now },
    type: String,
    cost: Number,
    description: String
  }]
});

export default mongoose.model('Vehicle', vehicleSchema);