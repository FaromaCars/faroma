import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json("No token, access denied");

    // Split "Bearer TOKEN"
    const token = authHeader.split(" ")[1]; // <--- THIS IS THE FIX
    if (!token) return res.status(401).json("Token missing");

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = verified.id;

    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};

export default authMiddleware;
