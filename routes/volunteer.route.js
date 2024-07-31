import express from 'express';
import protectVolunteer from '../middlewares/volunteer.middleware.js';
import { volunteerLogin, volunteerLogout, volunteerRegister } from '../controllers/auth.controller.js';
import { getVolunteerInfo, updateVolunteerInfo, joinActivity, leaveActivity, getVolunteerActivities } from '../controllers/volunteer.controller.js';
import Volunteer from "./../models/volunteer.model.js";
import Creator from './../models/creator.model.js';
import jwt from 'jsonwebtoken';

const volunteerRouter = express.Router();

volunteerRouter.post('/login', volunteerLogin);
volunteerRouter.post('/register', volunteerRegister);
volunteerRouter.get("/logout", volunteerLogout);

volunteerRouter.post("/update-info", protectVolunteer, updateVolunteerInfo)
volunteerRouter.get("/me", protectVolunteer, getVolunteerInfo)
volunteerRouter.get("/my-activities", protectVolunteer, getVolunteerActivities)
volunteerRouter.post("/activity/:id/join", protectVolunteer, joinActivity)
volunteerRouter.post("/activity/:id/leave", protectVolunteer, leaveActivity)
volunteerRouter.get("/check_login", async (req, res, next) => {
    const token = req.cookies['_volunteer_token'] || req.cookies['_creator_token'];
    const userType = req.cookies['_volunteer_token'] ? 'volunteer' : 'creator';

    if (!token) {
        return res.status(401).json({ loggedIn: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await ((userType === 'volunteer' ? Volunteer : Creator).findById(decoded.userId).select("-password"));

    if (!user) {
        return res.status(401).json({ loggedIn: false });
    }

    if (decoded) {
        return res.status(200).send({ loggedIn: true, userType });
    }

    return res.status(401).send({ loggedIn: false });
});

export default volunteerRouter;