import { Schema, model } from "mongoose";

const CreatorSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  profilePicture: { type: String, default: "" },
  socials: {
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  bio: { type: String, default: "" },
  socialScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  donationsReceived: { type: Number, default: 0 },
  stats: {
    treesPlanted: { type: Number, default: 0 },
    garbageCollected: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
  },
  activities: [{
    type: Schema.Types.ObjectId,
    ref: "Activity"
  }]
});

const Creator = model("Creator", CreatorSchema);

export default Creator;