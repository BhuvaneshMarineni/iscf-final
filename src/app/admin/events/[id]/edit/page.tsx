'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditEvent() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    locationType: 'location',
    location: '',
    onlineLink: '',
    category: 'Bible Studies',
    maxAttendees: '',
    registrationRequired: false,
    featured: false,
    recurring: false,
    schedule: 'One-time event',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const categories = [
    'Bible Studies',
    'Welcome Events',
    'Cultural Events',
    'Campus Life',
    'Leadership',
    'Service',
    'Friendships',
    'Celebrations'
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const eventData = await response.json();
          setFormData({
            title: eventData.title || '',
            description: eventData.description || '',
            date: eventData.date || '',
            time: eventData.time || '',
            endTime: eventData.endTime || '',
            locationType: eventData.locationType || 'location',
            location: eventData.location || '',
            onlineLink: eventData.onlineLink || '',
            category: eventData.category || 'Bible Studies',
            maxAttendees: eventData.maxAttendees?.toString() || '',
            registrationRequired: eventData.registrationRequired || false,
            featured: eventData.featured || false,
            recurring: eventData.recurring || false,
            schedule: eventData.schedule || 'One-time event',
            image: eventData.image || ''
          });
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        setModalMessage('Failed to upload image');
        setModalType('error');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setModalMessage('Error uploading image');
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let imageUrl = formData.image;
      
      // Upload image if there's a file
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          setModalMessage('Failed to upload image');
          setModalType('error');
          setShowModal(true);
          setIsSaving(false);
          return;
        }
      }

      // Auto-calculate status based on date and schedule
      let status = 'upcoming';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (formData.recurring) {
        status = formData.schedule;
      } else {
        const eventDate = new Date(formData.date);
        if (eventDate < today) {
          status = 'past';
        } else {
          status = 'upcoming';
        }
      }

      const eventData = {
        ...formData,
        image: imageUrl,
        status
      };

      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (response.ok) {
        setModalMessage('Event updated successfully!');
        setModalType('success');
        setShowModal(true);
        localStorage.setItem('admin-data-updated', Date.now().toString());
        window.dispatchEvent(new CustomEvent('admin-data-updated'));
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        setModalMessage('Failed to update event');
        setModalType('error');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setModalMessage('Error updating event');
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-sm text-gray-600">Update event details</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the event..."
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Optional (max 5MB, JPEG/PNG/WebP/GIF)</p>
                {isUploading && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
                {imageFile && !isUploading && (
                  <div className="mt-2">
                    <div className="flex items-center gap-4">
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-32 w-auto rounded border border-gray-300" />
                      <div>
                        <p className="text-sm text-gray-700">{imageFile.name}</p>
                        <p className="text-xs text-gray-500">{(imageFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
                {formData.image && !imageFile && !isUploading && (
                  <div className="mt-2">
                    <div className="flex items-center gap-4">
                      <img src={formData.image} alt="Preview" className="h-32 w-auto rounded border border-gray-300" />
                      <div>
                        <p className="text-sm text-gray-700">Current image</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors mt-1"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
                  This is a recurring event
                </label>
              </div>

              {formData.recurring && (
                <div>
                  <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                    Recurring Pattern *
                  </label>
                  <select
                    id="schedule"
                    name="schedule"
                    required
                    value={formData.schedule}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location & Capacity
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="location"
                      checked={formData.locationType === 'location'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">In-Person</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="online"
                      checked={formData.locationType === 'online'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">Online</span>
                  </label>
                </div>
              </div>

              {formData.locationType === 'location' ? (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., ODU Campus, University Center"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="onlineLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Online Link
                  </label>
                  <input
                    type="url"
                    id="onlineLink"
                    name="onlineLink"
                    value={formData.onlineLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., https://zoom.us/j/123456789"
                  />
                </div>
              )}

              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attendees
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  name="registrationRequired"
                  checked={formData.registrationRequired}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="registrationRequired" className="ml-2 block text-sm text-gray-900">
                  Registration required
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured event (appears prominently on website)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              {modalType === 'success' ? (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'success' ? 'Success' : 'Error'}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
