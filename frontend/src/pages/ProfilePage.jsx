import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authUser';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const ProfilePage = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [watchHistory, setWatchHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await axios.get('/api/v1/user/watch-history');
        setWatchHistory(response.data.watchHistory || []);
      } catch (error) {
        console.error('Error fetching watch history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchWatchHistory();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      await updateProfile({ username, currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      // Error is already handled in the store
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="md:col-span-2 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Account Information</h2>
            
            {message && (
              <div className={`p-3 mb-4 rounded ${message.includes('success') ? 'bg-green-900' : 'bg-red-900'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input 
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <input 
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                <input 
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                <input 
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isUpdatingProfile}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
          
          {/* Watch History */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Watch History</h2>
            
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin w-8 h-8 border-4 border-red-600 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {watchHistory.length > 0 ? (
                  watchHistory.map((item) => (
                    <div key={item._id} className="flex gap-3 border-b border-gray-800 pb-3">
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${item.posterPath}`} 
                        alt={item.title}
                        className="w-16 h-auto rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-xs text-gray-400">Watched on {new Date(item.watchedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No watch history yet</p>
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

export default ProfilePage; 