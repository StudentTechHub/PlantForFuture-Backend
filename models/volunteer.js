import { Schema, model } from "mongoose";

const VolunteerSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  socials: {
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  bio: { type: String, default: "" },
  contributionScore: { type: Number, default: 0 },
  recentContributions: [{
    type: Schema.Types.ObjectId,
    ref: "Contribution",
  }],
  createdAt: { type: Date, default: Date.now },
});

const Volunteer = model("Volunteer", VolunteerSchema);

export default Volunteer;