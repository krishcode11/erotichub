import express from "express";
import {
	getSimilarTvs,
	getTrendingTv,
	getTvDetails,
	getTvsByCategory,
	getTvTrailers,
	getTvCast,
	getTvReviews,
	getTvSeasonEpisodes,
	discoverTvShows,
	getTvVideos
} from "../controllers/tv.controller.js";

const router = express.Router();

router.get("/discover", discoverTvShows);
router.get("/trending", getTrendingTv);
router.get("/:id/trailers", getTvTrailers);
router.get("/:id/videos", getTvVideos);
router.get("/:id/details", getTvDetails);
router.get("/:id/similar", getSimilarTvs);
router.get("/:id/cast", getTvCast);
router.get("/:id/reviews", getTvReviews);
router.get("/:id/season/:seasonNumber", getTvSeasonEpisodes);
router.get("/:category", getTvsByCategory);

export default router;
