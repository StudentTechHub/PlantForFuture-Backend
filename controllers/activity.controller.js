import Activity from "../models/activity.model.js";

export const getActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await Activity.findById(id)
            .populate("creator")
            .populate("volunteers");

        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }

        return res.status(200).json(activity);
    } catch (error) {
        console.log("Get Activity Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const getUpcomingActivities = async (req, res) => {
    try {
        const activities = await Activity.find(
            { startDate: { $gte: new Date() } },
            {},
            { sort: { startDate: 1 } }
        )
            .populate("creator")
            .populate("volunteers");

        if (!activities) {
            return res.status(404).json({ error: "Activities not found" });
        }

        return res.status(200).json(activities);
    } catch (error) {
        console.log("Get Upcoming Activities Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity
            .find(
                { startDate: { $lt: new Date() } },
                {},
                { sort: { startDate: -1 } }
            )
            .populate("creator")
            .populate("volunteers");

        if (!activities) {
            return res.status(404).json({ error: "Activities not found" });
        }

        return res.status(200).json(activities);
    } catch (error) {
        console.log("Get Recent Activities Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}