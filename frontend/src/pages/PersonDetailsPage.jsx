import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

const PersonDetailsPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('movies');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch person details
        const personRes = await axios.get(`/api/v1/person/${id}`);
        setPerson(personRes.data);
        
        // Fetch credits
        const creditsRes = await axios.get(`/api/v1/person/${id}/credits`);
        setCredits({
          cast: creditsRes.data.cast || [],
          crew: creditsRes.data.crew || []
        });
        
        // Fetch images
        const imagesRes = await axios.get(`/api/v1/person/${id}/images`);
        setImages(imagesRes.data.profiles || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch person details:', error);
        setError(error.response?.data?.message || 'Failed to fetch person details');
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonDetails();
    }
  }, [id]);

  const getAge = (birthday) => {
    if (!birthday) return null;
    
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const sortedCredits = (type) => {
    if (type === 'cast') {
      return [...credits.cast].sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || '0000';
        const dateB = b.release_date || b.first_air_date || '0000';
        return dateB.localeCompare(dateA);
      });
    } else {
      return [...credits.crew].sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || '0000';
        const dateB = b.release_date || b.first_air_date || '0000';
        return dateB.localeCompare(dateA);
      });
    }
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

  if (error || !person) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center flex-col">
          <p className="text-xl">Person not found</p>
          <p className="text-gray-400">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <img 
                src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/placeholder-person.png'} 
                alt={person.name}
                className="w-full rounded-lg shadow-lg mb-6 bg-gray-800"
              />
              
              <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Known For</h3>
                  <p>{person.known_for_department}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Gender</h3>
                  <p>{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Not specified'}</p>
                </div>
                
                {person.birthday && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Birthday</h3>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(person.birthday).toLocaleDateString()} 
                      {getAge(person.birthday) && `(${getAge(person.birthday)} years old)`}
                    </p>
                  </div>
                )}
                
                {person.place_of_birth && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Place of Birth</h3>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {person.place_of_birth}
                    </p>
                  </div>
                )}
                
                {person.also_known_as && person.also_known_as.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Also Known As</h3>
                    <ul className="list-disc list-inside">
                      {person.also_known_as.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {person.imdb_id && (
                    <a 
                      href={`https://www.imdb.com/name/${person.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-yellow-600 text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-500"
                    >
                      <LinkIcon className="w-3 h-3" /> IMDb
                    </a>
                  )}
                  
                  {person.homepage && (
                    <a 
                      href={person.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-500"
                    >
                      <LinkIcon className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-4xl font-bold mb-6">{person.name}</h1>
            
            {person.biography && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Biography</h2>
                <p className="text-gray-300 whitespace-pre-line">{person.biography}</p>
              </div>
            )}
            
            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex space-x-8">
                <button 
                  onClick={() => setActiveTab('movies')}
                  className={`pb-4 px-1 ${activeTab === 'movies' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
                >
                  Acting
                </button>
                {credits.crew.length > 0 && (
                  <button 
                    onClick={() => setActiveTab('crew')}
                    className={`pb-4 px-1 ${activeTab === 'crew' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
                  >
                    Production & Directing
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('photos')}
                  className={`pb-4 px-1 ${activeTab === 'photos' ? 'text-red-600 border-b-2 border-red-600 font-medium' : 'text-gray-400'}`}
                >
                  Photos
                </button>
              </div>
            </div>
            
            {/* Acting Credits */}
            {activeTab === 'movies' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Acting ({sortedCredits('cast').length})</h2>
                
                {sortedCredits('cast').length > 0 ? (
                  <div className="space-y-4">
                    {sortedCredits('cast').map(credit => (
                      <Link 
                        key={`${credit.id}-${credit.character || Math.random()}`} 
                        to={`/${credit.media_type}/${credit.id}`}
                        className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition"
                      >
                        <img 
                          src={credit.poster_path ? `https://image.tmdb.org/t/p/w92${credit.poster_path}` : '/placeholder-poster.png'}
                          alt={credit.title || credit.name}
                          className="w-16 h-24 object-cover rounded bg-gray-800"
                        />
                        <div>
                          <h3 className="font-medium">{credit.title || credit.name}</h3>
                          <p className="text-sm text-gray-400">
                            {credit.character && `as ${credit.character}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {credit.release_date ? credit.release_date.split('-')[0] : 
                             credit.first_air_date ? credit.first_air_date.split('-')[0] : ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No acting credits found</p>
                )}
              </div>
            )}
            
            {/* Crew Credits */}
            {activeTab === 'crew' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Production & Directing ({sortedCredits('crew').length})</h2>
                
                {sortedCredits('crew').length > 0 ? (
                  <div className="space-y-4">
                    {sortedCredits('crew').map(credit => (
                      <Link 
                        key={`${credit.id}-${credit.job || Math.random()}`} 
                        to={`/${credit.media_type}/${credit.id}`}
                        className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition"
                      >
                        <img 
                          src={credit.poster_path ? `https://image.tmdb.org/t/p/w92${credit.poster_path}` : '/placeholder-poster.png'}
                          alt={credit.title || credit.name}
                          className="w-16 h-24 object-cover rounded bg-gray-800"
                        />
                        <div>
                          <h3 className="font-medium">{credit.title || credit.name}</h3>
                          <p className="text-sm text-gray-400">
                            {credit.job}
                          </p>
                          <p className="text-xs text-gray-500">
                            {credit.release_date ? credit.release_date.split('-')[0] : 
                             credit.first_air_date ? credit.first_air_date.split('-')[0] : ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No production or directing credits found</p>
                )}
              </div>
            )}
            
            {/* Photos */}
            {activeTab === 'photos' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Photos ({images.length})</h2>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <a 
                        key={index} 
                        href={`https://image.tmdb.org/t/p/original${image.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden hover:opacity-80 transition"
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w342${image.file_path}`}
                          alt={`${person.name} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No photos available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PersonDetailsPage; 