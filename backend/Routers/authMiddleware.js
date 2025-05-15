const jwt = require("jsonwebtoken");
const JWT_SECRET = "qBtxN5yLXV4vFJdfl8Ml9y2XKaQJQOZY91wMl/H6YcM=" ;
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Missing or invalid Authorization header:", authHeader);
        return res.status(400).json({ message: "Invalid or missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Validate the token
        req.user = decoded; // Attach user data (from payload) to the request
        console.log("Token verified, user data:", req.user);
        next(); // Pass control to the next middleware
    } catch (err) {
        console.error("Error verifying token:", err.message);
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
