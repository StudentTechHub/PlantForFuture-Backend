import express from "express";
import { getActivity, getRecentActivities, getUpcomingActivities } from "../controllers/activity.controller";

const activityRouter = express.Router();

activityRouter.get("/:id", getActivity);
activityRouter.get("/upcoming", getUpcomingActivities);
activityRouter.get("/recent", getRecentActivities);

export default activityRouter