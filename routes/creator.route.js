import express from 'express';
import protectCreator from '../middlewares/creator.middleware.js';
import { creatorLogin, creatorLogout, creatorRegister } from '../controllers/auth.controller.js';
import { createActivity, getCreatorActivities, getCreatorActivity, getCreatorInfo, updateCreatorInfo, deleteActivity, updateActivity } from '../controllers/creator.controller.js';
import Volunteer from "./models/volunteer.model.js";
import Creator from './models/creator.model.js';
import jwt from 'jsonwebtoken';
const creatorRouter = express.Router();

// ! Authorization
creatorRouter.post('/login', creatorLogin);
creatorRouter.post('/register', creatorRegister);
creatorRouter.get("/logout", creatorLogout);

creatorRouter.post("/update-info", protectCreator, updateCreatorInfo)
creatorRouter.get("/me", protectCreator, getCreatorInfo)
creatorRouter.get("/activities", protectCreator, getCreatorActivities)
creatorRouter.get("/activity/:id", protectCreator, getCreatorActivity)
creatorRouter.post("/create-activity", protectCreator, createActivity)
creatorRouter.delete("/activity/:id", protectCreator, deleteActivity)
creatorRouter.post("/update-activity/:id", protectCreator, updateActivity)
creatorRouter.get("/check_login", async (req, res, next) => {
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

export default creatorRouter;