import express from 'express';
import protectVolunteer from '../middlewares/volunteer.middleware.js';
import { volunteerLogin, volunteerLogout, volunteerRegister } from '../controllers/auth.controller.js';
import { getVolunteerInfo, updateVolunteerInfo, joinActivity, leaveActivity, getVolunteerActivities, getActivity } from '../controllers/volunteer.controller.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/login', volunteerLogin);
volunteerRouter.post('/register', volunteerRegister);
volunteerRouter.get("/logout", volunteerLogout);

volunteerRouter.post("/update-info", protectVolunteer, updateVolunteerInfo)
volunteerRouter.get("/me", protectVolunteer, getVolunteerInfo)
volunteerRouter.get("/my-activities", protectVolunteer, getVolunteerActivities)
volunteerRouter.post("/activity/:id/join", protectVolunteer, joinActivity)
volunteerRouter.post("/activity/:id/leave", protectVolunteer, leaveActivity)
volunteerRouter.get("/activity/:id", protectVolunteer, getActivity)

export default volunteerRouter;