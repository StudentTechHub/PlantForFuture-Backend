import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, creator, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie(creator ? "_creator_token" : "_volunteer_token", token, {
		maxAge: 24 * 60 * 60 * 1000, // MS
		// httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "none", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV == "production",
	});

	return token;
};

export default generateTokenAndSetCookie;
