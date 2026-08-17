import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import crypto from "crypto";

const bookingSchema = new Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      default: () => "FH-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    },
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true }, // E.164, e.g. 923001234567
    // "fullday" = whole property, multi-day; "shift" = single 12h slot on one date
    bookingType: { type: String, enum: ["fullday", "shift"], default: "fullday" },
    shiftSlot: { type: String, enum: ["day", "night", null], default: null },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    checkInTime: { type: String, default: "14:00" }, // 24h HH:MM
    checkOutTime: { type: String, default: "12:00" },
    guests: { type: Number, required: true, min: 1 },
    notes: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
    fee: { type: Number, default: 0, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    // Guest opted out of air conditioning; discounts the quoted fee.
    withoutAc: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ whatsapp: 1, createdAt: -1 });

export type BookingDoc = InferSchemaType<typeof bookingSchema>;

// mongoose.models guard keeps hot reloads from redefining the model
const Booking =
  (mongoose.models.Booking as Model<BookingDoc>) ||
  mongoose.model<BookingDoc>("Booking", bookingSchema);

export default Booking;
