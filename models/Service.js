import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    providerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    rate: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    refill: { type: Boolean, default: false },
    cancel: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
