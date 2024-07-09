import { Schema, model } from "mongoose";

const ContributionSchema = new Schema({
  volunteerId: { type: Schema.Types.ObjectId, ref: "Volunteer" },
  creatorId: { type: Schema.Types.ObjectId, ref: "Creator" },
  type: {
    type: String,
    enum: ["donation", "volunteerWork"],
    required: true
  },
  description: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  // Duration in milliseconds
  duration: { type: Number, required: () => this.type === "volunteerWork" },
});

const Contribution = model("Contribution", ContributionSchema);

export default Contribution;