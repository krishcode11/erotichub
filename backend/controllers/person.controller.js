import { fetchFromTMDB } from "../services/tmdb.service.js";

export const getPersonDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Person ID is required" });
    }
    
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}?language=en-US`);
    
    res.status(200).json({ success: true, person: data });
  } catch (error) {
    console.error("Error in getPersonDetails controller:", error.message);
    
    if (error.message.includes("404")) {
      return res.status(404).json({ success: false, message: "Person not found" });
    }
    
    res.status(500).json({ success: false, message: "Error fetching person details" });
  }
};

export const getPersonCredits = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Person ID is required" });
    }
    
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`);
    
    res.status(200).json({ success: true, credits: data });
  } catch (error) {
    console.error("Error in getPersonCredits controller:", error.message);
    res.status(500).json({ success: false, message: "Error fetching person credits" });
  }
};

export const getPersonImages = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Person ID is required" });
    }
    
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/images`);
    
    res.status(200).json({ success: true, profiles: data.profiles });
  } catch (error) {
    console.error("Error in getPersonImages controller:", error.message);
    res.status(500).json({ success: false, message: "Error fetching person images" });
  }
};

export const getPopularPeople = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}`);
    
    res.status(200).json({ 
      success: true, 
      results: data.results,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results
    });
  } catch (error) {
    console.error("Error in getPopularPeople controller:", error.message);
    res.status(500).json({ success: false, message: "Error fetching popular people" });
  }
};

export const searchPeople = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }
    
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`
    );
    
    res.status(200).json({ 
      success: true, 
      results: data.results,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results
    });
  } catch (error) {
    console.error("Error in searchPeople controller:", error.message);
    res.status(500).json({ success: false, message: "Error searching people" });
  }
}; 