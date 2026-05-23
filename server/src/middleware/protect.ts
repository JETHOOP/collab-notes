import {
    Request,
    Response,
    NextFunction
} from "express";

import jwt from "jsonwebtoken";

import User from "../models/user";

interface JwtPayload {
    id: string;
}

const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const authHeader = req.headers.authorization;

        // Check token exists

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            res.status(401).json({
                message: "No token provided"
            });

            return;
        }

        // Extract token

        const token = authHeader.split(" ")[1];

        // Verify token

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Find user

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {

            res.status(401).json({
                message: "User not found"
            });

            return;
        }


        req.user = user;

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid token"
        });

    }

};

export default protect;