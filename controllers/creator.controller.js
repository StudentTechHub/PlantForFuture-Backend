import Creator from '../models/creator.model.js';
import Activity from '../models/activity.model.js';

export const updateCreatorInfo = async (req, res) => {
    const { fullName, socials, bio, stats, gender } = req.body;

    try {
        const creator = await Creator.findById(req.creator._id);
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }

        if (fullName) creator.fullName = fullName;
        if (socials?.twitter) creator.socials.twitter = socials.twitter;
        if (socials?.instagram) creator.socials.instagram = socials.instagram;
        if (socials?.facebook) creator.socials.facebook = socials.facebook;
        if (socials?.youtube) creator.socials.youtube = socials.youtube;
        if (bio) creator.bio = bio;
        if (stats?.treesPlanted) creator.stats.treesPlanted = stats.treesPlanted;
        if (stats?.garbageCollected) creator.stats.garbageCollected = stats.garbageCollected;
        if (stats?.waterSaved) creator.stats.waterSaved = stats.waterSaved;
        if (gender) creator.gender = gender;

        await creator.save();

        const creatorData = creator.toObject();
        delete creatorData.password;

        return res.status(200).json(creatorData);
    } catch (e) {
        console.log("Update Creator Info Error:\n", e);
        return res.status(500).json({ error: e.message });
    }
}

export const getCreatorInfo = async (req, res) => {
    try {
        const creator = await Creator.findById(req.creator._id);
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }

        const creatorData = creator.toObject();
        delete creatorData.password;

        return res.status(200).json(creatorData);
    } catch (e) {
        console.log("Creator Info Error:\n", e);
        return res.status(500).json({ error: e.message });
    }
}

export const getCreatorActivities = async (req, res) => {
    try {
        const creator = await Creator.findById(req.creator._id).populate("activities");
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }

        return res.status(200).json(creator.activities);
    } catch (error) {
        console.log("Get Creator Activities Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const getCreatorActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await Activity.findById(id).populate("creator").populate("volunteers");

        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        return res.status(200).json(activity);
    } catch (e) {
        console.log("Get Creator Activity Error:\n", e);
        return res.status(500).json({ error: e.message });
    }
}

export const createActivity = async (req, res) => {
    const { title, description, type, startDate, endDate, location } = req.body;

    if (!title || !description || !type || !startDate || !endDate || !location) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const creator = await Creator.findById(req.creator._id);
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }

        const newActivity = new Activity({
            title,
            description,
            type,
            startDate,
            endDate,
            location,
            creator: req.creator._id
        });

        creator.activities.push(newActivity._id);

        await creator.save();
        await newActivity.save();

        return res.status(201).json(newActivity);
    } catch (e) {
        console.log("Create Activity Error:\n", e);
        return res.status(500).json({ error: e.message });
    }
}

export const deleteActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        const creator = await Creator.findById(req.creator._id);
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }

        creator.activities = creator.activities.filter(activityId => activityId.toString() !== id);

        await creator.save();
        await activity.save();

        return res.status(200).json({ message: "Activity deleted" });
    } catch (e) {
        console.log("Delete Activity Error:\n", e);
        return res.status(500).json({ error: e.message });
    }
}

export const updateActivity = async (req, res) => {
    const { id } = req.params;
    const { title, description, type, startDate, endDate, location } = req.body;

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        if (!activity.creator._id.equals(req.creator._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (title) activity.title = title;
        if (description) activity.description = description;
        if (type) activity.type = type;
        if (startDate) activity.startDate = startDate;
        if (endDate) activity.endDate = endDate;
        if (location) activity.location = location;

        await activity.save();

        return res.status(200).json(activity);
    } catch (e) {
        console.log("Update Activity Error:\n", e);
        return res.status(500).json({ error: e.message });
    }
}