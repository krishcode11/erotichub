import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, Plus, Star, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieSlider from '../components/MovieSlider';

const TvShowDetailsPage = () => {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTvDetails = async () => {
      setLoading(true);
      try {
        // Fetch TV show details
        const tvRes = await fetch(`/api/v1/tv/${id}/details`);
        const tvData = await tvRes.json();
        setTvShow(tvData);
        setSelectedSeason(1);

        // Fetch trailers
        const trailersRes = await fetch(`/api/v1/tv/${id}/trailers`);
        const trailersData = await trailersRes.json();
        setTrailers(trailersData);

        // Fetch similar TV shows
        const similarRes = await fetch(`/api/v1/tv/${id}/similar`);
        const similarData = await similarRes.json();
        setSimilarShows(similarData.results);

        // For reviews, cast and episodes, we could add these endpoints to backend
        // This is placeholder data
        setCast([
          { id: 1, name: 'Actor 1', character: 'Character 1', profile_path: '/abc.jpg' },
          { id: 2, name: 'Actor 2', character: 'Character 2', profile_path: '/def.jpg' },
          { id: 3, name: 'Actor 3', character: 'Character 3', profile_path: '/ghi.jpg' },
        ]);
        
        setReviews([
          { id: 1, author: 'User 1', content: 'Great show!', rating: 4.5, created_at: '2023-05-12' },
          { id: 2, author: 'User 2', content: 'Loved it!', rating: 5, created_at: '2023-05-15' },
        ]);
        
        setEpisodes([
          { id: 1, name: 'Episode 1', overview: 'Episode 1 description', episode_number: 1, still_path: '/ep1.jpg', air_date: '2023-01-01', runtime: 45 },
          { id: 2, name: 'Episode 2', overview: 'Episode 2 description', episode_number: 2, still_path: '/ep2.jpg', air_date: '2023-01-08', runtime: 42 },
          { id: 3, name: 'Episode 3', overview: 'Episode 3 description', episode_number: 3, still_path: '/ep3.jpg', air_date: '2023-01-15', runtime: 50 },
        ]);
      } catch (error) {
        console.error('Failed to fetch TV show details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTvDetails();
    }
  }, [id]);
  
  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    // In a real app, fetch episodes for the selected season
    // For now, we'll just use the placeholder data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>TV show not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {/* TV Show Banner */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), 
          url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})` 
        }}
      >
        <div className="absolute bottom-0 left-0 w-full px-4 py-10 bg-gradient-to-t from-black to-transparent">
          <div className="container mx-auto flex flex-col md:flex-row items-end md:items-center">
            <img 
              src={`https://image.tmdb.org/t/p/w342${tvShow.poster_path}`} 
              alt={tvShow.name} 
              className="w-32 md:w-64 rounded-md shadow-lg hidden md:block"
            />
            <div className="md:ml-8">
              <h1 className="text-3xl md:text-5xl font-bold">{tvShow.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-red-600 px-2 py-0.5 rounded text-sm">{tvShow.first_air_date.split('-')[0]}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />{tvShow.vote_average.toFixed(1)}</span>
                <span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}</span>
                <div className="flex gap-1 flex-wrap">
                  {tvShow.genres.map(genre => (
                    <span key={genre.id} className="text-sm px-2 py-0.5 bg-gray-800 rounded">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Play className="w-4 h-4" /> Play
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Plus className="w-4 h-4" /> My List
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Watch Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 ${activeTab === 'overview' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('episodes')}
              className={`pb-4 px-1 ${activeTab === 'episodes' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
            >
              Episodes
            </button>
            <button 
              onClick={() => setActiveTab('cast')}
              className={`pb-4 px-1 ${activeTab === 'cast' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
            >
              Cast
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-1 ${activeTab === 'reviews' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
            >
              Reviews
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
              <p className="text-gray-300 mb-8">{tvShow.overview}</p>
              
              {trailers.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Trailers & Clips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trailers.slice(0, 3).map(trailer => (
                      <iframe
                        key={trailer.key}
                        className="w-full aspect-video rounded"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title={trailer.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-gray-400 text-sm">Status</h4>
                    <p>{tvShow.status}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Network</h4>
                    <p>{tvShow.networks?.map(network => network.name).join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Type</h4>
                    <p>{tvShow.type}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Original Language</h4>
                    <p>{tvShow.original_language?.toUpperCase()}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">First Air Date</h4>
                    <p>{tvShow.first_air_date}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm">Last Air Date</h4>
                    <p>{tvShow.last_air_date}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Episodes Tab */}
          {activeTab === 'episodes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Episodes</h2>
                
                <div className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => handleSeasonChange(Number(e.target.value))}
                    className="appearance-none bg-gray-800 border border-gray-700 px-4 py-2 pr-10 rounded-md focus:outline-none"
                  >
                    {Array.from({ length: tvShow.number_of_seasons }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Season {i + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div key={episode.id} className="bg-gray-900 rounded-md overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 lg:w-1/4">
                        <img
                          src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : '/placeholder-episode.png'}
                          alt={episode.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 md:w-2/3 lg:w-3/4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          <div className="flex gap-2">
                            <span className="text-sm text-gray-400">{episode.runtime} min</span>
                            <button className="p-1 rounded-full bg-red-600 hover:bg-red-700">
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">Air date: {episode.air_date}</p>
                        <p className="text-sm text-gray-300">{episode.overview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Cast Tab */}
          {activeTab === 'cast' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cast.map(person => (
                  <Link to={`/person/${person.id}`} key={person.id} className="text-center hover:opacity-80 transition">
                    <img
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : '/placeholder-person.png'}
                      alt={person.name}
                      className="w-full aspect-[2/3] object-cover rounded bg-gray-800"
                    />
                    <h3 className="font-medium mt-2">{person.name}</h3>
                    <p className="text-sm text-gray-400">{person.character}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">Write a Review</button>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-gray-900 p-4 rounded">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{review.author}</p>
                            <p className="text-xs text-gray-400">{review.created_at}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-300">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reviews yet</p>
              )}
            </div>
          )}
        </div>
        
        {/* Similar Shows */}
        {similarShows.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">More Like This</h2>
            <MovieSlider movies={similarShows} />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TvShowDetailsPage; 