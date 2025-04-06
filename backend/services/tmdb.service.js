import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromTMDB = async (endpoint) => {
	try {
		// Construct the full URL with the base URL
		const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
		
		// Determine if the URL already has parameters
		const separator = url.includes('?') ? '&' : '?';
		
		// Append the API key as a query parameter instead of using Authorization header
		const urlWithApiKey = `${url}${separator}api_key=${ENV_VARS.TMDB_API_KEY}`;
		
		console.log(`Fetching from TMDB: ${urlWithApiKey}`);
		
		const options = {
			headers: {
				accept: "application/json",
			},
		};

		const response = await axios.get(urlWithApiKey, options);

		if (response.status !== 200) {
			console.error(`TMDB API Error: ${response.status} - ${response.statusText}`);
			throw new Error(`Failed to fetch data from TMDB: ${response.statusText}`);
		}

		return response.data;
	} catch (error) {
		console.error("TMDB API Error:", error.message);
		if (error.response) {
			console.error(`Status: ${error.response.status}`);
			console.error(`Data:`, error.response.data);
		}
		throw error;
	}
};
