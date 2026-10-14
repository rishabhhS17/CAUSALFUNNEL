import mongoose from "mongoose";

export const EVENT_TYPES = ["page_view", "click"];

const eventSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true },
    event_type: { type: String, required: true, enum: EVENT_TYPES },
    page_url: { type: String, required: true },
    timestamp: { type: Date, required: true },
    viewport_width: Number,
    page_height: Number,

    x: Number,
    y: Number,
    x_percent: Number,
    target: {
      tag: String,
      id: String,
      text: String,
    },
  },
  { versionKey: false }
);

eventSchema.index({ session_id: 1, timestamp: 1 });
eventSchema.index({ page_url: 1, event_type: 1 });

export const Event = mongoose.model("Event", eventSchema);
