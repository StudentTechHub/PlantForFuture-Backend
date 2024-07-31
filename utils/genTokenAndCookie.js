import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, creator, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	// res.cookie(creator ? "creator_token" : "volunteer_token", token, {
	// 	maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
	// 	httpOnly: true,
	// 	partition: true,
	// 	secure: true, // Requires HTTPS
	// 	sameSite: "None", // Allows cross-site cookies
	// 	// domain: "plantforfuture.netlify.app", // Domain name only, no protocol
	// 	// path: "/"                     // Root path
	// });
	res.setHeader('Set-Cookie', `${creator ? "_creator_token" : "_volunteer_token"}=${token}; Max-Age=${3600 * 24}; Path=/; SameSite=None; Secure; Partitioned;Priority=High;`)

	return token;
};

export default generateTokenAndSetCookie;
