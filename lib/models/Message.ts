import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const messageSchema = new Schema(
  {
    // Customer's WhatsApp number in E.164 without +, e.g. 923001234567
    whatsapp: { type: String, required: true, trim: true, index: true },
    direction: { type: String, enum: ["in", "out"], required: true },
    body: { type: String, required: true },
    profileName: { type: String, default: "" }, // WhatsApp profile name (incoming only)
    waMessageId: { type: String, default: "" }, // Meta message id, used to dedupe webhooks
    read: { type: Boolean, default: false }, // admin has seen it (incoming only)
  },
  { timestamps: true }
);

messageSchema.index({ whatsapp: 1, createdAt: 1 });
messageSchema.index(
  { waMessageId: 1 },
  { unique: true, partialFilterExpression: { waMessageId: { $gt: "" } } }
);

export type MessageDoc = InferSchemaType<typeof messageSchema>;

const Message =
  (mongoose.models.Message as Model<MessageDoc>) ||
  mongoose.model<MessageDoc>("Message", messageSchema);

export default Message;
