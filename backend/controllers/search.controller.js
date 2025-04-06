import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
	const { query } = req.params;
	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].profile_path,
					title: response.results[0].name,
					searchType: "person",
					createdAt: new Date(),
				},
			},
		});

		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchPerson controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function searchMovie(req, res) {
	const { query } = req.params;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].title,
					searchType: "movie",
					createdAt: new Date(),
				},
			},
		});
		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchMovie controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function searchTv(req, res) {
	const { query } = req.params;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].name,
					searchType: "tv",
					createdAt: new Date(),
				},
			},
		});
		res.json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchTv controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function multiSearch(req, res) {
	const { query } = req.params;
	const { page = 1 } = req.query;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		// Save first result to search history
		const firstResult = response.results[0];
		let searchHistoryItem = {
			id: firstResult.id,
			searchType: firstResult.media_type,
			createdAt: new Date(),
		};

		if (firstResult.media_type === 'movie') {
			searchHistoryItem.title = firstResult.title;
			searchHistoryItem.image = firstResult.poster_path;
		} else if (firstResult.media_type === 'tv') {
			searchHistoryItem.title = firstResult.name;
			searchHistoryItem.image = firstResult.poster_path;
		} else if (firstResult.media_type === 'person') {
			searchHistoryItem.title = firstResult.name;
			searchHistoryItem.image = firstResult.profile_path;
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: searchHistoryItem
			},
		});

		res.status(200).json({ 
			success: true, 
			results: response.results,
			page: response.page,
			total_pages: response.total_pages,
			total_results: response.total_results
		});
	} catch (error) {
		console.log("Error in multiSearch controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getSearchHistory(req, res) {
	try {
		res.status(200).json({ success: true, content: req.user.searchHistory });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function removeItemFromSearchHistory(req, res) {
	let { id } = req.params;

	id = parseInt(id);

	try {
		await User.findByIdAndUpdate(req.user._id, {
			$pull: {
				searchHistory: { id: id },
			},
		});

		res.status(200).json({ success: true, message: "Item removed from search history" });
	} catch (error) {
		console.log("Error in removeItemFromSearchHistory controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
