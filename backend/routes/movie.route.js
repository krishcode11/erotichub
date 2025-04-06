import express from "express";
import {
	getMovieDetails,
	getMoviesByCategory,
	getMovieTrailers,
	getSimilarMovies,
	getTrendingMovie,
	getMovieCast,
	getMovieReviews,
	discoverMovies,
	getMovieVideos
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/trending", getTrendingMovie);
router.get("/discover", discoverMovies);
router.get("/:id/trailers", getMovieTrailers);
router.get("/:id/videos", getMovieVideos);
router.get("/:id/details", getMovieDetails);
router.get("/:id/similar", getSimilarMovies);
router.get("/:id/cast", getMovieCast);
router.get("/:id/reviews", getMovieReviews);
router.get("/:category", getMoviesByCategory);

export default router;
