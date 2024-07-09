import express from 'express';
import protectCreator from '../middlewares/creator.middleware.js';
import { creatorLogin, creatorLogout, creatorRegister } from '../controllers/auth.controller.js';
import { createActivity, getCreatorActivities, getCreatorActivity, getCreatorInfo, updateCreatorInfo } from '../controllers/creator.controller.js';

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

export default creatorRouter;