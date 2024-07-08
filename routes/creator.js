import express from 'express';
import Creator from '../models/creator';
import bcrypt from 'bcryptjs';
import protectCreator from '../middleware/creator.middleware.js';

const creatorRouter = express.Router();

creatorRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Please fill in all fields');
    }

    try {
        const creator = await Creator
            .findOne({ username })
            .select('+password');

        if (!creator) {
            res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, creator.hashedPassword);

        if (!isMatch) {
            res.status(400).send('Invalid credentials');
        }

        generateTokenAndSetCookie(creator._id, res);

        res.status(200).json(creator);
    } catch (error) {
        console.log("Creator Login Error:\n", error);
        res.status(500).json({ error: error.message });
    }
});

creatorRouter.post('/register', async (req, res) => {
    const { fullName, username, email, password, confirmPassword } = req.body;

    if (!fullName || !username || !email || !password || !confirmPassword) {
        res.status(400).send('Please fill in all fields');
    }

    if (password !== confirmPassword) {
        res.status(400).send('Passwords do not match');
    }

    try {
        const existing = await Creator.findOne({ username, email });
        if (existing) {
            res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCreator = await Creator.create({ fullName, username, email, hashedPassword });

        generateTokenAndSetCookie(newCreator._id, res);

        await newCreator.save();

        res.status(201).json(newCreator);
    } catch (error) {
        console.log("Creator Register Error:\n", error);
        res.status(500).json({ error: error.message });
    }
});

creatorRouter.post("/logout", (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.log("Creator Logout Error:\n", error);
        res.status(500).json({ error: error.message });
    }
})

creatorRouter.post("/info", protectCreator, (req, res) => {
    const { socials, bio, profilePicture } = req.body;

})

creatorRouter.get("/me", protectCreator, async (req, res) => {
    try {
        const creator = await Creator.findById(req.creator._id);
        if (!creator) {
            res.status(404).send("Creator not found");
        }
        res.status(200).json(creator);
    } catch (e) {
        console.log("Creator Info Error:\n", e);
        res.status(500).json({ error: e.message });
    }
})

creatorRouter.get("/activities", protectCreator, async (req, res) => {
    try {
        const creator = await Creator.findById(req.creator._id).populate("activities");
        if (!creator) {
            res.status(404).send("Creator not found");
        }
        res.status(200).json(creator.activities);
    } catch (e) {
        console.log("Creator Activities Error:\n", e);
        res.status(500).json({ error: e.message });
    }
})

creatorRouter.get("/activity/:id", protectCreator, async (req, res) => {
    try {
        const creator = await Creator.findById(req.creator._id).populate("activities");
        if (!creator) {
            res.status(404).send("Creator not found");
        }
        const activity = creator.activities.find(activity => activity._id === req.params.id);
        if (!activity) {
            res.status(404).send("Activity not found");
        }
        res.status(200).json(activity);
    } catch (e) {
        console.log("Creator Activity Error:\n", e);
        res.status(500).json({ error: e.message });
    }
})

creatorRouter.post("/create-activity", protectCreator, async (req, res) => {
    const { title, description, type, duration } = req.body;

    if (!title || !description || !type || !duration) {
        res.status(400).send('Please fill in all fields');
    }

    try {
        const creator = await Creator.findById(req.creator._id);
        if (!creator) {
            res.status(404).send("Creator not found");
        }
        const newActivity = await Activity.create({
            title,
            description,
            type,
            duration,
            creator: creator._id
        });
        creator.activities.push(newActivity._id);
        await creator.save();
        res.status(201).json(newActivity);
    } catch (e) {
        console.log("Creator Create Activity Error:\n", e);
        res.status(500).json({ error: e.message });
    }
})

export default creatorRouter