import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Grid, ListFilter, Trash2, PlayCircle, X } from 'lucide-react';

const MyListPage = () => {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tv'
  const [sortBy, setSortBy] = useState('date_added'); // 'date_added', 'name', 'rating'
  const [customCategories, setCustomCategories] = useState([
    { id: 1, name: 'Favorites', items: [1, 3, 5] },
    { id: 2, name: 'Watch Later', items: [2, 4] },
    { id: 3, name: 'Action Films', items: [1, 4] }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const fetchMyList = async () => {
      setLoading(true);
      try {
        // This would normally be an API call to get the user's list
        // For demo, we'll use placeholder data
        setTimeout(() => {
          setMyList([
            { id: 1, title: 'Movie 1', poster_path: '/placeholder1.jpg', media_type: 'movie', vote_average: 8.5, added_at: '2023-06-15' },
            { id: 2, title: 'TV Show 1', poster_path: '/placeholder2.jpg', media_type: 'tv', vote_average: 9.2, added_at: '2023-07-20' },
            { id: 3, title: 'Movie 2', poster_path: '/placeholder3.jpg', media_type: 'movie', vote_average: 7.8, added_at: '2023-08-05' },
            { id: 4, title: 'TV Show 2', poster_path: '/placeholder4.jpg', media_type: 'tv', vote_average: 8.1, added_at: '2023-08-10' },
            { id: 5, title: 'Movie 3', poster_path: '/placeholder5.jpg', media_type: 'movie', vote_average: 6.9, added_at: '2023-09-01' },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch my list:', error);
        setLoading(false);
      }
    };

    fetchMyList();
  }, []);

  const handleRemoveFromList = (id) => {
    setMyList(myList.filter(item => item.id !== id));
    
    // Remove from custom categories
    setCustomCategories(categories => 
      categories.map(category => ({
        ...category,
        items: category.items.filter(itemId => itemId !== id)
      }))
    );
  };

  const handleAddToCategory = (itemId, categoryId) => {
    setCustomCategories(categories => 
      categories.map(category => 
        category.id === categoryId && !category.items.includes(itemId)
          ? { ...category, items: [...category.items, itemId] }
          : category
      )
    );
  };

  const handleRemoveFromCategory = (itemId, categoryId) => {
    setCustomCategories(categories => 
      categories.map(category => 
        category.id === categoryId
          ? { ...category, items: category.items.filter(id => id !== itemId) }
          : category
      )
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = Math.max(0, ...customCategories.map(c => c.id)) + 1;
      setCustomCategories([...customCategories, { id: newId, name: newCategoryName, items: [] }]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setCustomCategories(customCategories.filter(category => category.id !== categoryId));
    if (selectedCategory === categoryId.toString()) {
      setSelectedCategory('all');
    }
  };

  const getFilteredAndSortedList = () => {
    let filtered = [...myList];
    
    // Apply media type filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.media_type === filter);
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory);
      const category = customCategories.find(c => c.id === categoryId);
      if (category) {
        filtered = filtered.filter(item => category.items.includes(item.id));
      }
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'date_added':
      default:
        filtered.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
    }
    
    return filtered;
  };

  const filteredList = getFilteredAndSortedList();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">My List</h1>
          
          <div className="flex flex-wrap gap-3">
            {/* View Mode Toggle */}
            <div className="flex rounded-md overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 ${viewMode === 'grid' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 ${viewMode === 'list' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                title="List View"
              >
                <ListFilter className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter Dropdown */}
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
            
            {/* Sort Dropdown */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
            >
              <option value="date_added">Recently Added</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Categories */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded ${selectedCategory === 'all' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                >
                  All Items ({myList.length})
                </button>
                
                {customCategories.map(category => (
                  <div key={category.id} className="flex items-center justify-between group">
                    <button 
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`flex-grow text-left px-3 py-2 rounded ${selectedCategory === category.id.toString() ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                    >
                      {category.name} ({category.items.length})
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {isAddingCategory ? (
                <div className="mt-4">
                  <input 
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddCategory}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }}
                      className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingCategory(true)}
                  className="mt-4 text-sm text-gray-400 hover:text-white"
                >
                  + Add New Category
                </button>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 lg:col-span-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent"></div>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Your list is empty</h3>
                <p className="text-gray-400 mb-4">
                  {filter !== 'all' 
                    ? `No ${filter === 'movie' ? 'movies' : 'TV shows'} in your list.` 
                    : selectedCategory !== 'all' 
                      ? 'No items in this category.' 
                      : 'Start adding your favorite movies and TV shows to your list.'}
                </p>
                <Link to="/browse/popular" className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
                  Browse Content
                </Link>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredList.map(item => (
                      <div key={item.id} className="relative group">
                        <div className="relative bg-gray-800 rounded-md overflow-hidden aspect-[2/3]">
                          <img 
                            src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : '/placeholder-poster.png'} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center">
                            ★ {item.vote_average}
                          </div>
                          
                          {/* Overlay with actions */}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                            <Link to={`/${item.media_type}/${item.id}`} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md w-full justify-center">
                              <PlayCircle className="w-4 h-4" /> Play
                            </Link>
                            
                            <div className="relative w-full">
                              <button 
                                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md w-full justify-center"
                                onClick={() => handleRemoveFromList(item.id)}
                              >
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </div>
                            
                            {/* Category dropdown */}
                            <div className="w-full">
                              <select 
                                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-md w-full"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") return;
                                  
                                  const [action, categoryId] = value.split(':');
                                  const catId = parseInt(categoryId);
                                  
                                  if (action === 'add') {
                                    handleAddToCategory(item.id, catId);
                                  } else if (action === 'remove') {
                                    handleRemoveFromCategory(item.id, catId);
                                  }
                                  
                                  // Reset select to default value after action
                                  e.target.value = "";
                                }}
                              >
                                <option value="">Add to category...</option>
                                <optgroup label="Add to">
                                  {customCategories
                                    .filter(cat => !cat.items.includes(item.id))
                                    .map(cat => (
                                      <option key={`add-${cat.id}`} value={`add:${cat.id}`}>{cat.name}</option>
                                    ))}
                                </optgroup>
                                {customCategories.some(cat => cat.items.includes(item.id)) && (
                                  <optgroup label="Remove from">
                                    {customCategories
                                      .filter(cat => cat.items.includes(item.id))
                                      .map(cat => (
                                        <option key={`remove-${cat.id}`} value={`remove:${cat.id}`}>{cat.name}</option>
                                      ))}
                                  </optgroup>
                                )}
                              </select>
                            </div>
                          </div>
                        </div>
                        <h3 className="mt-2 text-sm font-medium truncate">{item.title}</h3>
                        <p className="text-xs text-gray-400">
                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredList.map(item => (
                      <div key={item.id} className="flex bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                        <img 
                          src={item.poster_path ? `https://image.tmdb.org/t/p/w154${item.poster_path}` : '/placeholder-poster.png'} 
                          alt={item.title} 
                          className="w-24 h-36 object-cover"
                        />
                        <div className="flex-grow p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-400">
                              {item.media_type === 'movie' ? 'Movie' : 'TV Show'} • Added on {new Date(item.added_at).toLocaleDateString()}
                            </p>
                            
                            {/* Categories badges */}
                            {customCategories.some(cat => cat.items.includes(item.id)) && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {customCategories
                                  .filter(cat => cat.items.includes(item.id))
                                  .map(cat => (
                                    <span key={cat.id} className="text-xs bg-gray-800 rounded-full px-2 py-1 flex items-center gap-1">
                                      {cat.name}
                                      <button 
                                        onClick={() => handleRemoveFromCategory(item.id, cat.id)}
                                        className="hover:text-red-500"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                              <span className="text-yellow-400">★</span> 
                              <span>{item.vote_average}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Link 
                                to={`/${item.media_type}/${item.id}`}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                              >
                                <PlayCircle className="w-4 h-4" /> Play
                              </Link>
                              
                              <div className="relative">
                                <select 
                                  className="appearance-none bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded-md text-sm"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "") return;
                                    
                                    const [action, categoryId] = value.split(':');
                                    const catId = parseInt(categoryId);
                                    
                                    if (action === 'add') {
                                      handleAddToCategory(item.id, catId);
                                    }
                                    
                                    // Reset select to default value after action
                                    e.target.value = "";
                                  }}
                                >
                                  <option value="">Category</option>
                                  {customCategories
                                    .filter(cat => !cat.items.includes(item.id))
                                    .map(cat => (
                                      <option key={`add-${cat.id}`} value={`add:${cat.id}`}>{cat.name}</option>
                                    ))}
                                </select>
                              </div>
                              
                              <button 
                                onClick={() => handleRemoveFromList(item.id)}
                                className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyListPage; 