'use client';

import { useEffect, useState } from 'react';
import { Camera, Users, Heart, Calendar, Globe, Award, MapPin, Clock, X, Play } from 'lucide-react';
import { getGalleryAlbums, type GalleryAlbum } from '@/lib/api';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState<GalleryAlbum | null>(null);
  const [activeSection, setActiveSection] = useState('photos');
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumsData = await getGalleryAlbums();
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error fetching gallery albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const categories = ['All', 'Welcome Events', 'Bible Studies', 'Cultural Events', 'Campus Life', 'Leadership', 'Service', 'Friendships', 'Celebrations'];

  const filteredItems = selectedCategory === 'All' 
    ? albums 
    : albums.filter(album => album.category === selectedCategory);

  const photoItems = filteredItems; // All albums are photo albums for now
  const videoItems: GalleryAlbum[] = []; // No video albums in current data structure

  const openModal = (album: GalleryAlbum) => {
    setSelectedMedia(album);
    // Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMedia(null);
    // Re-enable body scroll when modal closes
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen">
      {/* Gallery Stats */}
      <section className="py-16 bg-white px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Photo & Video Gallery</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Capturing moments of friendship, faith, and community since 1995. 
              See the joy and connections that make ISCF a home away from home.
            </p>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-primary-600 mb-2">29</div>
                <div className="text-gray-700">Years of Memories</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-700">Events Captured</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-yellow-600 mb-2">20,000+</div>
                <div className="text-gray-700">Students Featured</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-red-600 mb-2">100+</div>
                <div className="text-gray-700">Countries Represented</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Toggle */}
      <section className="py-8 bg-gray-50 px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg p-1 border border-gray-300">
                <button
                  onClick={() => setActiveSection('photos')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeSection === 'photos'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📸 Photos
                </button>
                <button
                  onClick={() => setActiveSection('videos')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeSection === 'videos'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🎥 Videos
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    category === selectedCategory
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-primary-50 hover:border-primary-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photos Section */}
      {activeSection === 'photos' && (
        <section className="py-16 bg-white px-6 md:px-12 lg:px-16">
          <div className="container mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
                <p className="text-gray-600">Browse through our collection of memorable moments</p>
              </div>
              
              {photoItems.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg">
                    {loading ? 'Loading photos...' : 'No photos found for this category'}
                  </p>
                </div>
              ) : (
                loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-300"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-5 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {photoItems.map((album) => (
                      <div 
                        key={album.id} 
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => openModal(album)}
                      >
                        <div className="aspect-square overflow-hidden relative">
                          {album.images[0] ? (
                            <img
                              src={album.images[0]?.thumbnail || album.images[0]?.url}
                              alt={album.images[0]?.alt || album.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                console.error('Image load error:', album.images[0]?.url);
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                const parent = img.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
                                  fallback.innerHTML = '<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Camera className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {album.images.length} photos
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                              {album.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{album.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{album.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {activeSection === 'videos' && (
        <section className="py-16 bg-white px-6 md:px-12 lg:px-16">
          <div className="container mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Gallery</h2>
                <p className="text-gray-600">Watch highlights from our events and community</p>
              </div>
              
              {videoItems.length === 0 ? (
                <div className="text-center py-12">
                  <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg">
                    {loading ? 'Loading videos...' : 'No videos found for this category'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videoItems.map((album) => (
                    <div 
                      key={album.id} 
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => openModal(album)}
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={album.images[0]?.thumbnail || album.images[0]?.url}
                          alt={album.images[0]?.alt || album.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-google-blue-600 bg-google-blue-50 px-2 py-1 rounded">
                            {album.category}
                          </span>
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                            VIDEO
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{album.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{album.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{selectedMedia.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedMedia.images.map((image, index) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Image load error in modal:', image.url);
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280"%3EImage not found%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
                    {selectedMedia.category}
                  </span>
                  <span className="text-sm text-gray-500 ml-3">
                    By {selectedMedia.photographer} • {new Date(selectedMedia.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedMedia.description}</p>
                {selectedMedia.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedMedia.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Moments */}
      <section className="py-16 bg-gray-50 px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Moments</h2>
              <p className="text-lg text-gray-600">Special highlights from our community over the years</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Largest Welcome Banquet"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Award className="w-6 h-6 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-600">Record Breaking</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Largest Welcome Banquet Ever</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our Fall 2019 Welcome Banquet welcomed over 1,000 international students and American 
                    families in one incredible evening of food, friendship, and celebration.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="25th Anniversary Celebration"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Calendar className="w-6 h-6 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-primary-600">Milestone</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">25th Anniversary Celebration</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In 2020, we celebrated 25 years of ministry with alumni from around the world joining 
                    virtually to share stories of how ISCF impacted their lives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}