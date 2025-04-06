import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, Filter, X } from 'lucide-react';

const BrowseCategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [releaseYear, setReleaseYear] = useState('');
  const [minRating, setMinRating] = useState('');
  
  // Get current filter values from URL params
  useEffect(() => {
    const genre = searchParams.get('genre');
    const sort = searchParams.get('sort_by');
    const year = searchParams.get('year');
    const rating = searchParams.get('vote_average.gte');
    const page = searchParams.get('page');
    
    if (genre) setSelectedGenres(genre.split(',').map(Number));
    if (sort) setSortBy(sort);
    if (year) setReleaseYear(year);
    if (rating) setMinRating(rating);
    if (page) setCurrentPage(Number(page));
  }, [searchParams]);
  
  // Fetch genres for the filters
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // This is placeholder data - in a real app, fetch from API
        setGenres([
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
          { id: 18, name: 'Drama' },
          { id: 14, name: 'Fantasy' },
          { id: 36, name: 'History' },
          { id: 27, name: 'Horror' },
          { id: 10749, name: 'Romance' },
          { id: 878, name: 'Science Fiction' },
          { id: 53, name: 'Thriller' }
        ]);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Fetch content based on category and filters
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Create a new URLSearchParams for backend API
        const params = new URLSearchParams();
        if (selectedGenres.length) params.append('with_genres', selectedGenres.join(','));
        if (sortBy) params.append('sort_by', sortBy);
        if (releaseYear) params.append('year', releaseYear);
        if (minRating) params.append('vote_average.gte', minRating);
        params.append('page', currentPage.toString());
        
        let endpoint = '';
        // Determine API endpoint based on category
        switch(category) {
          case 'movies':
            endpoint = `/api/v1/movie/${category}?${params.toString()}`;
            break;
          case 'tv':
            endpoint = `/api/v1/tv/${category}?${params.toString()}`;
            break;
          case 'trending':
            endpoint = `/api/v1/trending?${params.toString()}`;
            break;
          default:
            endpoint = `/api/v1/movie/popular?${params.toString()}`;
        }
        
        // For demonstration, we'll simulate the API response
        setTimeout(() => {
          // Simulate data structure from TMDB
          setContent(Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            title: `${category === 'tv' ? 'TV Show' : 'Movie'} ${i + 1}`,
            poster_path: `/placeholder-${i % 5}.jpg`,
            vote_average: (Math.random() * 5 + 5).toFixed(1), // Random score between 5-10
            release_date: `202${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
            media_type: category === 'tv' ? 'tv' : 'movie'
          })));
          setTotalResults(120);
          setTotalPages(6);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to fetch content:', error);
        setLoading(false);
      }
    };
    
    fetchContent();
    
    // Update URL with current filters
    const newParams = new URLSearchParams();
    if (selectedGenres.length) newParams.append('genre', selectedGenres.join(','));
    if (sortBy) newParams.append('sort_by', sortBy);
    if (releaseYear) newParams.append('year', releaseYear);
    if (minRating) newParams.append('vote_average.gte', minRating);
    if (currentPage > 1) newParams.append('page', currentPage.toString());
    
    setSearchParams(newParams);
  }, [category, selectedGenres, sortBy, releaseYear, minRating, currentPage, setSearchParams]);
  
  const handleGenreChange = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
    // Reset to page 1 when changing filters
    setCurrentPage(1);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  
  const handleYearChange = (e) => {
    setReleaseYear(e.target.value);
    setCurrentPage(1);
  };
  
  const handleRatingChange = (e) => {
    setMinRating(e.target.value);
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setReleaseYear('');
    setMinRating('');
    setCurrentPage(1);
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };
  
  // Get human-readable title for the category
  const getCategoryTitle = () => {
    switch(category) {
      case 'popular':
        return 'Popular Movies';
      case 'top_rated':
        return 'Top Rated Movies';
      case 'upcoming':
        return 'Upcoming Movies';
      case 'now_playing':
        return 'Now Playing Movies';
      case 'on_the_air':
        return 'TV Shows On Air';
      case 'airing_today':
        return 'TV Shows Airing Today';
      case 'trending':
        return 'Trending';
      default:
        return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{getCategoryTitle()}</h1>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-900 rounded-lg mb-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" /> Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreChange(genre.id)}
                      className={`text-xs px-3 py-1 rounded-full ${
                        selectedGenres.includes(genre.id) 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort By Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Sort By</h3>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 px-4 py-2 pr-10 rounded-md focus:outline-none"
                  >
                    <option value="popularity.desc">Popularity (Descending)</option>
                    <option value="popularity.asc">Popularity (Ascending)</option>
                    <option value="vote_average.desc">Rating (Descending)</option>
                    <option value="vote_average.asc">Rating (Ascending)</option>
                    <option value="release_date.desc">Release Date (Descending)</option>
                    <option value="release_date.asc">Release Date (Ascending)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              {/* Year Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Release Year</h3>
                <div className="relative">
                  <select
                    value={releaseYear}
                    onChange={handleYearChange}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 px-4 py-2 pr-10 rounded-md focus:outline-none"
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              {/* Rating Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-300">Minimum Rating</h3>
                <div className="relative">
                  <select
                    value={minRating}
                    onChange={handleRatingChange}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 px-4 py-2 pr-10 rounded-md focus:outline-none"
                  >
                    <option value="">Any Rating</option>
                    <option value="9">9+</option>
                    <option value="8">8+</option>
                    <option value="7">7+</option>
                    <option value="6">6+</option>
                    <option value="5">5+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="text-sm text-gray-400 mb-6">
          {loading ? 'Loading...' : `Showing ${(currentPage - 1) * 20 + 1}-${Math.min(currentPage * 20, totalResults)} of ${totalResults} results`}
        </div>
        
        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {content.map(item => (
                <a 
                  key={item.id} 
                  href={`/${item.media_type}/${item.id}`}
                  className="transition hover:opacity-75"
                >
                  <div className="relative bg-gray-800 rounded-md overflow-hidden aspect-[2/3]">
                    <img 
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : '/placeholder-poster.png'} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center">
                      ★ {item.vote_average}
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.release_date?.split('-')[0]}</p>
                </a>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // This creates a window of 5 page numbers around the current page
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-9 h-9 flex items-center justify-center rounded ${
                          currentPage === pageNumber ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BrowseCategoryPage; 