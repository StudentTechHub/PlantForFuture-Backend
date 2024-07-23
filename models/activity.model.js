import { Schema, model } from "mongoose";

const ActivitySchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  // TODO: restrict to specific types such as plantatioNDriver, beachCleanup, etc.
  type: { type: String, required: true, },
  description: { type: String, required: true },
  title: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "Creator" },
  volunteers: [{ type: Schema.Types.ObjectId, ref: "Volunteer" }],
  location: {type: String, required:true},
  // Duration in milliseconds
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Activity = model("Activity", ActivitySchema);

export default Activity;