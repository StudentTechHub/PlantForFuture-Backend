import jwt from "jsonwebtoken";
import Creator from "../models/creator.model.js";

const protectCreator = async (req, res, next) => {
	try {
		const token = req.cookies._creator_token;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const creator = await Creator.findById(decoded.userId).select("-password");

		if (!creator) {
			return res.status(404).json({ error: "User not found" });
		}

		req.creator = creator;

		next();
	} catch (error) {
		console.log("Error in creator middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectCreator;