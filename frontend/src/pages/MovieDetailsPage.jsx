import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, Plus, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieSlider from '../components/MovieSlider';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        // Fetch movie details
        const movieRes = await fetch(`/api/v1/movie/${id}/details`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch trailers
        const trailersRes = await fetch(`/api/v1/movie/${id}/trailers`);
        const trailersData = await trailersRes.json();
        setTrailers(trailersData);

        // Fetch similar movies
        const similarRes = await fetch(`/api/v1/movie/${id}/similar`);
        const similarData = await similarRes.json();
        setSimilarMovies(similarData.results);

        // For reviews and cast, we could add these endpoints to backend
        // This is placeholder data
        setCast([
          { id: 1, name: 'Actor 1', character: 'Character 1', profile_path: '/abc.jpg' },
          { id: 2, name: 'Actor 2', character: 'Character 2', profile_path: '/def.jpg' },
          { id: 3, name: 'Actor 3', character: 'Character 3', profile_path: '/ghi.jpg' },
        ]);
        
        setReviews([
          { id: 1, author: 'User 1', content: 'Great movie!', rating: 4.5, created_at: '2023-05-12' },
          { id: 2, author: 'User 2', content: 'Loved it!', rating: 5, created_at: '2023-05-15' },
        ]);
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

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

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Movie not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {/* Movie Banner */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), 
          url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` 
        }}
      >
        <div className="absolute bottom-0 left-0 w-full px-4 py-10 bg-gradient-to-t from-black to-transparent">
          <div className="container mx-auto flex flex-col md:flex-row items-end md:items-center">
            <img 
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} 
              alt={movie.title} 
              className="w-32 md:w-64 rounded-md shadow-lg hidden md:block"
            />
            <div className="md:ml-8">
              <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-red-600 px-2 py-0.5 rounded text-sm">{movie.release_date.split('-')[0]}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />{movie.vote_average.toFixed(1)}</span>
                <span>{movie.runtime} min</span>
                <div className="flex gap-1 flex-wrap">
                  {movie.genres.map(genre => (
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
              <p className="text-gray-300 mb-8">{movie.overview}</p>
              
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
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">More Like This</h2>
            <MovieSlider movies={similarMovies} />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MovieDetailsPage; 