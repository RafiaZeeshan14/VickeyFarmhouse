import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { PRICE_DEFAULTS, SHIFT_TIME_DEFAULTS } from "../pricing";

// Singleton settings document (always _id "global")
const settingSchema = new Schema(
  {
    _id: { type: String, default: "global" },
    weekend24Hrs: { type: Number, default: PRICE_DEFAULTS.weekend24Hrs, min: 0 },
    nonWeekend24Hrs: { type: Number, default: PRICE_DEFAULTS.nonWeekend24Hrs, min: 0 },
    weekend12Hrs: { type: Number, default: PRICE_DEFAULTS.weekend12Hrs, min: 0 },
    weekend12HrsDay: { type: Number, default: PRICE_DEFAULTS.weekend12HrsDay, min: 0 },
    nonWeekend12HrsDay: {
      type: Number,
      default: PRICE_DEFAULTS.nonWeekend12HrsDay,
      min: 0,
    },
    nonWeekend40Person12Hrs: {
      type: Number,
      default: PRICE_DEFAULTS.nonWeekend40Person12Hrs,
      min: 0,
    },
    dayShiftStart: { type: String, default: SHIFT_TIME_DEFAULTS.dayShiftStart },
    dayShiftEnd: { type: String, default: SHIFT_TIME_DEFAULTS.dayShiftEnd },
    nightShiftStart: { type: String, default: SHIFT_TIME_DEFAULTS.nightShiftStart },
    nightShiftEnd: { type: String, default: SHIFT_TIME_DEFAULTS.nightShiftEnd },
  },
  { timestamps: true }
);

export type SettingDoc = InferSchemaType<typeof settingSchema>;

const Setting =
  (mongoose.models.Setting as Model<SettingDoc>) ||
  mongoose.model<SettingDoc>("Setting", settingSchema);

export async function getSettings() {
  return (
    (await Setting.findById("global")) || (await Setting.create({ _id: "global" }))
  );
}

export default Setting;
