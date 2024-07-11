import Volunteer from "../models/volunteer.model.js";
import Activity from "../models/activity.model.js";

export const updateVolunteerInfo = async (req, res) => {
    const { fullName, socials, bio, gender } = req.body;

    try {
        const volunteer = await Volunteer.findById(req.volunteer._id);

        if (!volunteer) {
            res.status(404).json({ error: "Volunteer not found" });
        }

        if (fullName) volunteer.fullName = fullName;
        if (socials?.twitter) volunteer.socials.twitter = socials.twitter;
        if (socials?.instagram) volunteer.socials.instagram = socials.instagram;
        if (socials?.facebook) volunteer.socials.facebook = socials.facebook;
        if (socials?.youtube) volunteer.socials.youtube = socials.youtube;
        if (bio) volunteer.bio = bio;
        if (gender) volunteer.gender = gender;

        await volunteer.save();

        const volunteerData = volunteer.toObject();
        delete volunteerData.password

        res.status(200).json(volunteerData);
    } catch (error) {
        console.log("Update Volunteer Info Error:\n", error);
        res.status(500).json({ error: error.message });
    }
}

export const getVolunteerInfo = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.volunteer._id);
        if (!volunteer) {
            res.status(404).json({ error: "Volunteer not found" });
        }

        const volunteerData = volunteer.toObject();
        delete volunteerData.password;

        res.status(200).json(volunteerData);
    } catch (error) {
        console.log("Get Volunteer Info Error:\n", error);
        res.status(500).json({ error: error.message });
    }
}

export const getVolunteerActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ volunteers: { $elemMatch: { $eq: req.volunteer._id } } });

        if (!activities) {
            res.status(404).json({ error: "Activities not found" });
        }

        res.status(200).json(activities);
    } catch (error) {
        console.log("Get Volunteer Activities Error:\n", error);
        res.status(500).json({ error: error.message });
    }
}

export const joinActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await Activity.findById(id);

        if (!activity) {
            res.status(404).json({ error: "Activity not found" });
        }

        if (activity.volunteers.includes(req.volunteer._id)) {
            return res.status(400).json({ error: "Volunteer already joined this activity" });
        }

        activity.volunteers.push(req.volunteer._id);
        await activity.save();

        res.status(200).json(activity);
    } catch (error) {
        console.log("Join Activity Error:\n", error);
        res.status(500).json({ error: error.message });
    }
}

export const leaveActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await Activity.findById(id);

        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }

        if (!activity.volunteers.includes(req.volunteer._id)) {
            return res.status(400).json({ error: "Volunteer not joined this activity" });
        }

        activity.volunteers = activity.volunteers.filter(volunteer => !volunteer.equals(req.volunteer._id));

        await activity.save();
        console.log("Activity after leaving: ", activity);

        res.status(200).json(activity);

    } catch (error) {
        console.log("Leave Activity Error:\n", error);
        res.status(500).json({ error: error.message });
    }
}