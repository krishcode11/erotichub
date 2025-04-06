import express from "express";
import {
	getSearchHistory,
	removeItemFromSearchHistory,
	searchMovie,
	searchPerson,
	searchTv,
	multiSearch
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/multi/:query", multiSearch);
router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);

router.get("/history", getSearchHistory);

router.delete("/history/:id", removeItemFromSearchHistory);

export default router;
