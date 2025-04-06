import express from "express";
import { 
  getPersonDetails, 
  getPersonCredits, 
  getPersonImages, 
  getPopularPeople, 
  searchPeople 
} from "../controllers/person.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/popular", protectRoute, getPopularPeople);
router.get("/search", protectRoute, searchPeople);
router.get("/:id", protectRoute, getPersonDetails);
router.get("/:id/credits", protectRoute, getPersonCredits);
router.get("/:id/images", protectRoute, getPersonImages);

export default router; 