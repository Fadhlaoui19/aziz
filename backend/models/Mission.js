import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  itinerary: String,
  status: { type: String, enum: ['planned', 'ongoing', 'completed', 'canceled'], default: 'planned' }
});

export default mongoose.model('Mission', missionSchema);