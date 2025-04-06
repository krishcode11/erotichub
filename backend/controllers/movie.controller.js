import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
	try {
		const data = await fetchFromTMDB("/trending/movie/day?language=en-US");
		const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];

		res.json({ success: true, content: randomMovie });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieTrailers(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`/movie/${id}/videos?language=en-US`);
		res.json({ success: true, trailers: data.results });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieVideos(req, res) {
	const { id } = req.params;
	try {
		// Get all videos (not just trailers)
		const videosData = await fetchFromTMDB(`/movie/${id}/videos?language=en-US`);
		
		// Get watch providers (where to stream the movie)
		const providersData = await fetchFromTMDB(`/movie/${id}/watch/providers`);
		
		// Create result object with different video types and watch providers
		const result = {
			trailers: videosData.results.filter(video => video.type === 'Trailer'),
			teasers: videosData.results.filter(video => video.type === 'Teaser'),
			clips: videosData.results.filter(video => video.type === 'Clip'),
			behindTheScenes: videosData.results.filter(video => video.type === 'Behind the Scenes'),
			featurettes: videosData.results.filter(video => video.type === 'Featurette'),
			watchProviders: providersData.results
		};
		
		res.status(200).json({ 
			success: true, 
			videos: result,
			allVideos: videosData.results
		});
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).json({ success: false, message: "Movie not found" });
		}
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieDetails(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`/movie/${id}?language=en-US&append_to_response=videos,images`);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getSimilarMovies(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`/movie/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMoviesByCategory(req, res) {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieCast(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`/movie/${id}/credits?language=en-US`);
		res.status(200).json({ success: true, cast: data.cast, crew: data.crew });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).json({ success: false, message: "Movie not found" });
		}
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieReviews(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`/movie/${id}/reviews?language=en-US&page=1`);
		res.status(200).json({ success: true, reviews: data.results });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).json({ success: false, message: "Movie not found" });
		}
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function discoverMovies(req, res) {
	try {
		const { 
			with_genres, 
			sort_by = 'popularity.desc', 
			year,
			'vote_average.gte': minRating,
			page = 1
		} = req.query;
		
		let url = `/discover/movie?language=en-US&page=${page}&sort_by=${sort_by}`;
		
		if (with_genres) url += `&with_genres=${with_genres}`;
		if (year) url += `&primary_release_year=${year}`;
		if (minRating) url += `&vote_average.gte=${minRating}`;
		
		const data = await fetchFromTMDB(url);
		res.status(200).json({ 
			success: true, 
			results: data.results,
			page: data.page,
			total_pages: data.total_pages,
			total_results: data.total_results
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
