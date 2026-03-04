import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

const getBearerToken = (req) => {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return req.header("authheader");
};

export const validateAccessToken = (req, res, next) => {
    const token = getBearerToken(req);

    if (!token) {
        return res.status(401).json({ msg: "Access token is missing" });
    }

    try {
        const decoded = jwt.verify(token, jwtAccessSecret);
        req.user = decoded.user ?? decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired access token" });
    }
};

export const validateRefreshToken = (token) => {
    return jwt.verify(token, jwtRefreshSecret);
};

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, jwtAccessSecret, { expiresIn: accessTokenExpiresIn });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: refreshTokenExpiresIn });
};
