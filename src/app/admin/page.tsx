'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, Users, Calendar, Camera, Settings, LogOut, Eye, Edit, Trash2, Plus, BarChart3, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import type { Event, Photo } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('admin-active-tab');
      return savedTab || 'overview';
    }
    return 'overview';
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Photo | null>(null);
  const [isAddingImages, setIsAddingImages] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [storyFormData, setStoryFormData] = useState({
    name: '',
    country: '',
    program: '',
    year: '',
    testimonial: '',
    status: 'Current Student',
    currentPosition: '',
    featured: false
  });

  // Wait for zustand persist to hydrate
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect if not logged in (after hydration)
  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, router, hydrated]);

  // Fetch data from APIs
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsRes, galleryRes, storiesRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/gallery'),
        fetch('/api/testimonials')
      ]);
      
      const eventsData = await eventsRes.json();
      const galleryData = await galleryRes.json();
      const storiesData = await storiesRes.json();
      
      setEvents(eventsData.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        status: e.status,
        attendees: e.currentAttendees || 0
      })));
      
      setPhotos(galleryData.map((g: any) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        date: g.date,
        count: g.images?.length || 0,
        images: g.images || []
      })));
      
      setStories(storiesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  // Save active tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-active-tab', activeTab);
    }
  }, [activeTab]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAlbum]);

  // Calculate stats with proper typing
  const getStats = () => [
    { label: 'Total Events', value: events.length.toString(), icon: Calendar, color: 'blue' },
    { label: 'Gallery Albums', value: photos.length.toString(), icon: Camera, color: 'green' },
    { label: 'Stories', value: stories.length.toString(), icon: MessageSquare, color: 'purple' },
  ];

  const stats = getStats();

  const deleteEvent = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setEvents((events as Event[]).filter(e => e.id !== id));
          // Trigger data refresh on events page
          localStorage.setItem('admin-data-updated', Date.now().toString());
          window.dispatchEvent(new CustomEvent('admin-data-updated'));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const deletePhoto = async (id: number) => {
    if (confirm('Are you sure you want to delete this photo album?')) {
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setPhotos((photos as Photo[]).filter(p => p.id !== id));
          // Trigger data refresh on events page
          localStorage.setItem('admin-data-updated', Date.now().toString());
          window.dispatchEvent(new CustomEvent('admin-data-updated'));
        }
      } catch (error) {
        console.error('Error deleting photo album:', error);
      }
    }
  };

  const deleteStory = async (id: number) => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        const response = await fetch(`/api/testimonials/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchData();
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const deleteImage = async (albumId: number, imageId: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/gallery/${albumId}/images/${imageId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the data
          fetchData();
          if (selectedAlbum && selectedAlbum.id === albumId) {
            const updatedAlbum = photos.find(p => p.id === albumId);
            if (updatedAlbum) {
              setSelectedAlbum(updatedAlbum);
            }
          }
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleAddImages = async () => {
    if (newImageFiles.length === 0) return;

    try {
      const formData = new FormData();
      newImageFiles.forEach(file => formData.append('files', file));

      console.log('Uploading images:', newImageFiles.length, 'files to album:', selectedAlbum?.id);

      const response = await fetch(`/api/gallery/${selectedAlbum?.id}/images`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Upload response:', result);

      if (response.ok) {
        // Refresh the data
        await fetchData();
        if (selectedAlbum) {
          const updatedAlbum = photos.find(p => p.id === selectedAlbum.id);
          if (updatedAlbum) {
            setSelectedAlbum(updatedAlbum);
          }
        }
        setNewImageFiles([]);
        setIsAddingImages(false);
      } else {
        console.error('Upload failed:', result);
        alert(`Failed to add images: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding images:', error);
      alert('Error adding images');
    }
  };

  const handleEditStory = (story: any) => {
    setEditingStory(story);
    setStoryFormData({
      name: story.name,
      country: story.country,
      program: story.program,
      year: story.year,
      testimonial: story.testimonial,
      status: story.status,
      currentPosition: story.currentPosition,
      featured: story.featured
    });
  };

  const handleUpdateStory = async () => {
    try {
      const response = await fetch(`/api/testimonials/${editingStory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyFormData),
      });

      if (response.ok) {
        await fetchData();
        setEditingStory(null);
      } else {
        alert('Failed to update story');
      }
    } catch (error) {
      console.error('Error updating story:', error);
      alert('Error updating story');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ISCF Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-5 h-5 inline mr-2" />
              View Site
            </Link>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 inline mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'gallery', label: 'Gallery', icon: Camera },
              { id: 'stories', label: 'Stories', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/admin/events/add"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add Event</h3>
                    <p className="text-sm text-gray-600">Create a new event</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/gallery/upload"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
                    <p className="text-sm text-gray-600">Add to gallery</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
              <Link
                href="/admin/events/add"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Event
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.attendees}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/events/${event.id}/edit`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Gallery</h2>
              <Link
                href="/admin/gallery/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Photos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
                    {photo.images && photo.images.length > 0 && photo.images[0] ? (
                      <img
                        src={photo.images[0].thumbnail || photo.images[0].url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image load error:', photo.images?.[0]?.url);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {photo.images?.length || 0} photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{photo.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{photo.category}</p>
                    <p className="text-xs text-gray-500 mb-2">{photo.date} • {photo.images?.length || 0} photos</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedAlbum(photo)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition-colors"
                      >
                        Manage Images
                      </button>
                      <button 
                        onClick={() => deletePhoto(photo.id)}
                        className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Stories</h2>
              <span className="text-sm text-gray-600">
                {stories.length} total stories
              </span>
            </div>

            {stories.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No stories found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                          <p className="text-sm text-gray-600">{story.country} • {story.program}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditStory(story)}
                          className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStory(story.id)}
                          className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{story.testimonial}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Image Management Modal */}
        {selectedAlbum && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAlbum.title}</h3>
                  <p className="text-sm text-gray-600">{selectedAlbum.category} • {selectedAlbum.images?.length || 0} photos</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingImages(!isAddingImages)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Images
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAlbum(null);
                      setIsAddingImages(false);
                      setNewImageFiles([]);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {isAddingImages && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewImageFiles(files);
                      }}
                      className="w-full mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddImages}
                        disabled={newImageFiles.length === 0}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Upload {newImageFiles.length} {newImageFiles.length === 1 ? 'Image' : 'Images'}
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingImages(false);
                          setNewImageFiles([]);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {selectedAlbum.images && selectedAlbum.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedAlbum.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.alt}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => deleteImage(selectedAlbum.id, image.id)}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                            title="Delete image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{image.caption}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No images in this album</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Story Edit Modal */}
        {editingStory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Edit Story</h3>
                <button
                  onClick={() => setEditingStory(null)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={storyFormData.name}
                      onChange={(e) => setStoryFormData({ ...storyFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={storyFormData.country}
                      onChange={(e) => setStoryFormData({ ...storyFormData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                    <input
                      type="text"
                      value={storyFormData.program}
                      onChange={(e) => setStoryFormData({ ...storyFormData, program: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={storyFormData.year}
                      onChange={(e) => setStoryFormData({ ...storyFormData, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={storyFormData.status}
                      onChange={(e) => setStoryFormData({ ...storyFormData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Current Student">Current Student</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                    <input
                      type="text"
                      value={storyFormData.currentPosition}
                      onChange={(e) => setStoryFormData({ ...storyFormData, currentPosition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                    <textarea
                      value={storyFormData.testimonial}
                      onChange={(e) => setStoryFormData({ ...storyFormData, testimonial: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={storyFormData.featured}
                      onChange={(e) => setStoryFormData({ ...storyFormData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Featured story
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingStory(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}