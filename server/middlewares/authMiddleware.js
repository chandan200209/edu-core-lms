import { clerkClient } from "@clerk/express";
import { getAuth } from '@clerk/express';
// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        // const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId);
        // checking if the user is educator or not
        if (response.publicMetadata.role !== 'educator') {
            return res.json({ success: false, message: 'Unauthorized Access' });
        }
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
} 