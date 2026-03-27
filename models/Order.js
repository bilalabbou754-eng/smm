import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerOrderId: { type: String, required: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    link: { type: String, required: true },
    quantity: { type: Number, required: true },
    charge: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "In progress", "Completed", "Partial", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
