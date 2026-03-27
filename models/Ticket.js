import mongoose, { Schema } from "mongoose";

const TicketMessageSchema = new Schema(
  {
    senderRole: { type: String, enum: ["user", "admin"], required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

const TicketSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    messages: [TicketMessageSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
