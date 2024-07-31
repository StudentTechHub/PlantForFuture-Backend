import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, creator, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie(creator ? "_creator_token" : "_volunteer_token", token, {
		maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
		// httpOnly: true,
		// secure: true, // Requires HTTPS
		sameSite: "none", // Allows cross-site cookies
		// domain: "plantforfuture.netlify.app", // Domain name only, no protocol
		path: "/"                     // Root path
	});

	return token;
};

export default generateTokenAndSetCookie;
