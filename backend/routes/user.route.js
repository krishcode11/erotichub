import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
    updateProfile, 
    getWatchHistory, 
    addToMyList, 
    removeFromMyList, 
    getMyList 
} from "../controllers/user.controller.js";

const router = express.Router();

// Profile routes
router.put("/profile", protectRoute, updateProfile);
router.get("/watch-history", protectRoute, getWatchHistory);

// My List routes
router.get("/my-list", protectRoute, getMyList);
router.post("/my-list", protectRoute, addToMyList);
router.delete("/my-list/:mediaId", protectRoute, removeFromMyList);

export default router; 