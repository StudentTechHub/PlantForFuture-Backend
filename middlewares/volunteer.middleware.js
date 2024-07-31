import jwt from "jsonwebtoken";
import Volunteer from "../models/volunteer.model.js";

const protectVolunteer = async (req, res, next) => {
	try {
		const token = req.cookies.volunteer_token;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const volunteer = await Volunteer.findById(decoded.userId).select("-password");

		if (!volunteer) {
			return res.status(404).json({ error: "User not found" });
		}

		req.volunteer = volunteer;

		next();
	} catch (error) {
		console.log("Error in volunteer middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectVolunteer;