'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Heart, BookOpen, Award, X } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { getEvents, formatEventDate, formatEventTime } from '@/lib/api';
import type { Event } from '@/lib/api';
import CalendarComponent from '@/components/ui/Calendar';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // Function to trigger data refresh
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Listen for storage events to refresh data when admin makes changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-data-updated') {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from same window
    const handleCustomEvent = () => {
      refreshData();
    };
    
    window.addEventListener('admin-data-updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-data-updated', handleCustomEvent);
    };
  }, []);

  const weeklyPrograms = events.filter(event => event.recurring && (event.schedule === 'Weekly' || event.schedule === 'Daily' || event.schedule === 'Monthly' || event.schedule === 'Yearly' || event.schedule.startsWith('Every')));
  
  const now = new Date();
  
  const upcomingEvents = events.filter(event => {
    // Skip recurring events - they're already in weeklyPrograms
    if (event.recurring) return false;
    
    // Parse date and time in local timezone
    const [year, month, day] = event.date.split('-').map(Number);
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const isUpcoming = eventDate >= now;
    return isUpcoming && (event.status === 'upcoming' || event.status === 'active');
  });

  const pastEvents = events.filter(event => {
    // Skip recurring events
    if (event.recurring) return false;
    
    // Parse date and time in local timezone
    const [year, month, day] = event.date.split('-').map(Number);
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const isPast = eventDate < now;
    return isPast;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    // Re-enable body scroll when modal closes
    document.body.style.overflow = 'unset';
  };

  // Handle modal opening
  const openModal = (event: Event) => {
    setSelectedEvent(event);
    // Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
  };

  const totalActiveEvents = weeklyPrograms.length + upcomingEvents.length;

  const renderWeeklyProgramCard = (event: Event, index: number) => {
    const colors = [
      { primary: 'blue', secondary: 'indigo' },
      { primary: 'green', secondary: 'emerald' },
      { primary: 'purple', secondary: 'violet' },
      { primary: 'red', secondary: 'rose' }
    ];
    const colorConfig = colors[index % colors.length];
    
    return (
      <div 
        key={event.id} 
        className={clsx(
          'bg-white rounded-xl shadow-lg overflow-hidden border-t-4',
          `border-${colorConfig.primary}-500`
        )}
      >
        <div className={clsx(
          'p-6 text-white',
          `bg-gradient-to-r from-${colorConfig.primary}-600 to-${colorConfig.secondary}-700`
        )}>
          <div className="flex items-center">
            <BookOpen className="w-10 h-10 mr-4" />
            <div>
              <h3 className="text-2xl font-bold">{event.title}</h3>
              <p className={`text-${colorConfig.primary}-100`}>{event.category}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6">
            {event.description}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3" />
              <span>{event.schedule}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3" />
              <span>{event.currentAttendees} participants</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium',
              event.status === 'active' 
                ? `bg-${colorConfig.primary}-100 text-${colorConfig.primary}-800`
                : 'bg-gray-100 text-gray-800'
            )}>
              {event.status === 'active' ? 'Active' : 'Paused'}
            </span>
            <Link
              href="/contact"
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                `bg-${colorConfig.primary}-600 text-white hover:bg-${colorConfig.primary}-700`
              )}
            >
              Join Program
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderUpcomingEventCard = (event: Event) => (
    <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-blue-300" />
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {event.category}
          </span>
          {event.featured && (
            <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Featured
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          {event.description.length > 100 
            ? `${event.description.substring(0, 100)}...` 
            : event.description
          }
        </p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-3" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-3" />
            <span>{formatEventTime(event.time)}</span>
            {event.endTime && (
              <span> - {formatEventTime(event.endTime)}</span>
            )}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-3" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-3" />
            <span>
              {event.currentAttendees}
              {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium',
            event.status === 'active' ? 'bg-green-100 text-green-800' :
            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          )}>
            {event.status === 'active' ? 'Active' : 
             event.status === 'upcoming' ? 'Upcoming' : 
             event.status}
          </span>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {event.registrationRequired ? 'Register' : 'Learn More'}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* View Toggle */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg p-1 border border-gray-300 shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'px-6 py-2 rounded-md font-medium transition-colors',
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  📋 List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={clsx(
                    'px-6 py-2 rounded-md font-medium transition-colors',
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  📅 Calendar View
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Event Calendar</h2>
                <p className="text-lg text-gray-600">View all events by date</p>
              </div>
              
              <CalendarComponent 
                events={events} 
                onEventClick={handleEventClick}
              />
            </div>
          </div>
        </section>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Error State */}
          {!loading && error && (
            <section className="py-16 bg-gradient-to-b from-green-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                  <div className="text-red-500 text-lg mb-4">{error}</div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {!loading && !error && totalActiveEvents === 0 && (
            <section className="py-16 bg-gradient-to-b from-green-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg">No events at the moment</p>
                </div>
              </div>
            </section>
          )}

          {/* Combined Small Count View (<=2 events total) */}
          {!loading && !error && totalActiveEvents <= 2 && totalActiveEvents > 0 && (
            <section className="py-16 bg-gradient-to-b from-green-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Events</h2>
                    <p className="text-lg text-gray-600">Join us at ISCF</p>
                  </div>

                  <div className={clsx(
                    'grid gap-8',
                    totalActiveEvents === 1 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2'
                  )}>
                    {weeklyPrograms.map((event, index) => renderWeeklyProgramCard(event, index))}
                    {upcomingEvents.map((event) => renderUpcomingEventCard(event))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Recurring Programs */}
          {!loading && totalActiveEvents > 2 && weeklyPrograms.length > 0 && (
            <section className="py-16 bg-gradient-to-b from-green-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recurring Programs</h2>
                    <p className="text-lg text-gray-600">Regular opportunities to connect and grow together</p>
                  </div>

                  <div className={clsx(
                    'grid gap-8',
                    weeklyPrograms.length === 1 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2'
                  )}>
                    {weeklyPrograms.map((event, index) => renderWeeklyProgramCard(event, index))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          {!loading && totalActiveEvents > 2 && upcomingEvents.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                    <p className="text-lg text-gray-600">Special events and celebrations coming up</p>
                  </div>

                  <div className={clsx(
                    'grid gap-8',
                    upcomingEvents.length === 1 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  )}>
                    {upcomingEvents.map((event) => renderUpcomingEventCard(event))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Loading State */}
          {loading && (
            <section className="py-16 bg-gradient-to-b from-green-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recurring Programs</h2>
                    <p className="text-lg text-gray-600">Regular opportunities to connect and grow together</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 animate-pulse">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mb-6"></div>
                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-2 mb-6">
                          <div className="h-4 bg-gray-300 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Past Events</h2>
                    <p className="text-lg text-gray-600">Events that have already taken place</p>
                  </div>

                  <div className={clsx(
                    'grid gap-8',
                    pastEvents.length === 1 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  )}>
                    {pastEvents.map((event) => (
                      <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden opacity-75">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {event.category}
                            </span>
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              Completed
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-700 mb-3">{event.title}</h3>
                          <p className="text-gray-500 leading-relaxed mb-4">
                            {event.description.length > 100 
                              ? `${event.description.substring(0, 100)}...` 
                              : event.description
                            }
                          </p>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-gray-400">
                              <Calendar className="w-4 h-4 mr-3" />
                              <span>{formatEventDate(event.date)}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-4 h-4 mr-3" />
                              <span>{formatEventTime(event.time)}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <MapPin className="w-4 h-4 mr-3" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="aspect-video overflow-hidden rounded-lg mb-6 bg-gradient-to-br from-blue-100 to-indigo-100">
                {selectedEvent.image ? (
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-blue-300" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mr-3">
                    {selectedEvent.category}
                  </span>
                  {selectedEvent.featured && (
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedEvent.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{formatEventDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-blue-600" />
                      <span>
                        {formatEventTime(selectedEvent.time)}
                        {selectedEvent.endTime && ` - ${formatEventTime(selectedEvent.endTime)}`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-blue-600" />
                      <span>
                        {selectedEvent.currentAttendees}
                        {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees}`} attendees
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={clsx(
                  'px-4 py-2 rounded-full font-medium',
                  selectedEvent.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedEvent.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                )}>
                  {selectedEvent.status === 'active' ? 'Active' : 
                   selectedEvent.status === 'upcoming' ? 'Upcoming' : 
                   selectedEvent.status}
                </span>
                <div className="space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href="/contact"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {selectedEvent.registrationRequired ? 'Register Now' : 'Get More Info'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl mb-8 text-blue-100">
              Experience friendship, faith, and genuine hospitality. All international students are welcome!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
              >
                Get Connected
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}