'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, Heart, Users, Globe, MapPin, Clock, Home as HomeIcon, 
  Star, Quote, GraduationCap, Award, Sparkles, ChevronRight, ChevronLeft
} from 'lucide-react';
import { getTestimonials, getEvents } from '@/lib/api';
import type { Testimonial, Event } from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import GlassCard from '@/components/ui/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [weeklyPrograms, setWeeklyPrograms] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeBannerEvent, setActiveBannerEvent] = useState(0);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [storySubmissionMessage, setStorySubmissionMessage] = useState<string | null>(null);
  const [storyForm, setStoryForm] = useState({
    name: '',
    country: '',
    program: '',
    testimonial: '',
  });

  const handleStoryInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setStoryForm(currentForm => ({ ...currentForm, [name]: value }));
  };

  const handleStorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingStory(true);
    setStorySubmissionMessage(null);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyForm),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Unable to submit your story');
      }

      setTestimonials(currentTestimonials => [responseData, ...currentTestimonials].slice(0, 3));
      setStoryForm({ name: '', country: '', program: '', testimonial: '' });
      setShowStoryForm(false);
      setStorySubmissionMessage('Thank you for sharing your story!');
    } catch (submissionError) {
      setStorySubmissionMessage(
        submissionError instanceof Error ? submissionError.message : 'Unable to submit your story'
      );
    } finally {
      setIsSubmittingStory(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [testimonialsData, eventsData] = await Promise.all([
          getTestimonials(),
          getEvents()
        ]);
        setTestimonials([...testimonialsData].sort(() => Math.random() - 0.5).slice(0, 3));
        
        // Separate recurring programs from other events
        const weekly = eventsData.filter((event: Event) => 
          event.recurring && (event.schedule === 'Weekly' || event.schedule === 'Daily' || event.schedule === 'Monthly' || event.schedule === 'Yearly' || event.schedule === 'Every Thursday' || event.schedule === 'Every Monday' || event.schedule === 'Every Tuesday' || event.schedule === 'Every Wednesday' || event.schedule === 'Every Friday' || event.schedule === 'Every Saturday' || event.schedule === 'Every Sunday')
        );
        const otherEvents = eventsData.filter((event: Event) => 
          !weekly.includes(event)
        );
        
        setWeeklyPrograms(weekly);
        
        const now = new Date();
        
        const upcoming = otherEvents.filter((event: Event) => {
          // Parse date and time in local timezone
          const [year, month, day] = event.date.split('-').map(Number);
          const [hours, minutes] = event.time.split(':').map(Number);
          const eventDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
          const isUpcoming = eventDate >= now;
          return isUpcoming;
        });
        
        setEvents(upcoming.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedEvents = events;

  useEffect(() => {
    if (displayedEvents.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerEvent(prev => (prev + 1) % displayedEvents.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [displayedEvents.length]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      
      {/* ── Upcoming Event Banner ── */}
      {!loading && displayedEvents.length > 0 && (
        <section className="py-8 bg-[#F8FAFC]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="bg-white border border-[#E5E7EB] overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                borderRadius: 28,
                minHeight: 160,
                boxShadow: '0 16px 50px rgba(15,23,42,0.08)',
              }}
            >
              <div className="relative">
                {displayedEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`transition-opacity duration-700 ease-in-out ${
                      index === activeBannerEvent ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6 lg:p-7">

                      {/* Col 1 — Thumbnail */}
                      <div className="shrink-0 hidden md:block">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            style={{ width: 120, height: 120, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 hover:scale-105 transition-transform duration-300"
                            style={{ width: 120, height: 120, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                          >
                            <Calendar className="w-8 h-8 text-blue-300" />
                          </div>
                        )}
                      </div>

                      {/* Col 2 — Title + Meta */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[22px] lg:text-[28px] font-extrabold text-[#0F172A] leading-tight mb-3">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#64748B]">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#2563EB]" />{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#2563EB]" />{event.time}</span>
                          {event.locationType === 'online' ? (
                            <a href={event.onlineLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#2563EB] hover:underline">
                              <MapPin className="w-3.5 h-3.5" />
                              Online Event
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#2563EB]" />{event.location}</span>
                          )}
                        </div>
                      </div>

                      {/* Col 3 — Description */}
                      <div className="hidden xl:block shrink-0" style={{ maxWidth: 360 }}>
                        <p className="text-[17px] text-[#64748B] leading-[1.6] line-clamp-3">
                          {event.description}
                        </p>
                      </div>

                      {/* Col 4 — Buttons */}
                      <div className="flex flex-col gap-3 shrink-0 w-full lg:w-auto">
                        <Link
                          href="/events"
                          className="inline-flex items-center justify-center gap-2 text-white font-semibold text-sm w-full lg:w-auto px-7 transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            height: 56,
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                            boxShadow: '0 4px 16px rgba(37,99,235,0.30)',
                          }}
                        >
                          View Event Details →
                        </Link>
                        <button
                          className="inline-flex items-center justify-center gap-2 text-[#1D4ED8] font-semibold text-sm w-full lg:w-auto px-7 bg-white border-2 border-[#2563EB] hover:bg-[#EEF2FF] transition-all duration-200"
                          style={{ height: 52, borderRadius: 16 }}
                        >
                          <Calendar className="w-4 h-4" />
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Carousel Dots */}
                {displayedEvents.length > 1 && (
                  <div className="flex justify-center items-center gap-2 pb-5">
                    {displayedEvents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveBannerEvent(index)}
                        className="h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: index === activeBannerEvent ? 20 : 10,
                          background: index === activeBannerEvent ? '#2563EB' : '#CBD5E1',
                        }}
                        aria-label={`Go to event ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Hero Section ── */}
      <section className="relative bg-[#F8FAFC] pt-10 pb-20 overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.03,
        }} />
        {/* Soft blue glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

            {/* ── Left — 45% ── */}
            <div className="flex-[0_0_auto] w-full lg:w-[45%] animate-fade-left">
              <h1 className="font-extrabold leading-[1.08] tracking-tight mb-6"
                style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
                <span className="text-[#0F172A]">International Students,</span>
                <br />
                <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  You Belong Here.
                </span>
              </h1>

              <p className="text-[#4B5563] text-lg leading-[1.7] mb-10 max-w-[480px]">
                Since 1995, we've been creating a warm community and home away from home
                for international students at Old Dominion University through friendship,
                faith, and genuine hospitality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 20px rgba(37,99,235,0.30)' }}
                >
                  Join Our Events →
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#E5E7EB] text-[#374151] font-bold text-base px-8 py-4 rounded-2xl hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-200"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* ── Right — 55% ── */}
            <div className="flex-1 w-full relative animate-fade-right">
              <div className="relative">
                {/* Main image */}
                <div className="overflow-hidden" style={{ borderRadius: 36, boxShadow: '0 20px 60px rgba(15,23,42,0.12)' }}>
                  <img
                    src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Diverse international students at ISCF"
                    className="w-full object-cover"
                    style={{ height: 'clamp(340px, 40vw, 520px)', transform: `translateY(${scrollY * 0.04}px)` }}
                  />
                </div>

                {/* Vertical floating stat cards — overlapping right side */}
                <div className="absolute top-6 right-[-8px] flex flex-col gap-3">
                  {[
                    { Icon: Globe, title: 'Students from 50+ Countries', sub: 'Diverse global community', bg: '#DBEAFE', color: '#2563EB' },
                    { Icon: Heart, title: 'Faith & Friendship',           sub: 'Building lasting relationships', bg: '#FEE2E2', color: '#EF4444' },
                    { Icon: HomeIcon, title: 'Home Away From Home',       sub: 'Warm hospitality & support',    bg: '#DCFCE7', color: '#16A34A' },
                  ].map(({ Icon, title, sub, bg, color }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white border border-[#F1F5F9] pr-4 pl-3 py-3 hover:-translate-y-0.5 transition-transform duration-300"
                      style={{ borderRadius: 24, minWidth: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }}
                    >
                      <div className="p-2.5 rounded-xl shrink-0" style={{ background: bg }}>
                        <Icon style={{ width: 20, height: 20, color }} />
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A] text-sm leading-tight">{title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-30 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 lg:mb-28">
            {/* Left - Text */}
            <ScrollReveal direction="left">
              <h2 className="text-section-mobile lg:text-section font-bold text-[#0F172A] mb-6">
                We Are So Glad You Are Here!
              </h2>
              
              <div className="h-1.5 w-24 bg-gradient-primary rounded-full mb-8"></div>
              
              <p className="text-body-lg text-[#64748B] mb-6 leading-relaxed">
                Since 1995, our heart has been to serve and walk alongside international students 
                as you study and experience life in the United States. Through the friendship and 
                hospitality of American families and individuals, you will find a warm community, 
                a home away from home, and people eager to share life.
              </p>
              
              <p className="text-body-lg text-[#64748B] mb-8 leading-relaxed">
                Here, you can ask questions, explore faith, learn about Jesus, and build lasting 
                relationships across cultures. We believe every student is uniquely gifted and 
                deeply valued, and we count it a joy to journey with you.
              </p>
              
              <Button variant="outline" size="md" showArrow href="/about" className="group">
                Learn Our Story
              </Button>
            </ScrollReveal>
            
            {/* Right - Illustration/Photo */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="rounded-[32px] overflow-hidden shadow-large">
                  <img
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Welcoming international student community"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-soft border border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <Calendar className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">29+ Years</p>
                      <p className="text-sm text-[#64748B]">Serving students</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Feature Cards Below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: 'Diverse Community', desc: 'Students from every corner of the world', color: 'bg-primary-50 text-primary-600' },
              { icon: Heart, title: 'Genuine Hospitality', desc: 'Warm welcomes from American families', color: 'bg-red-50 text-red-500' },
              { icon: Sparkles, title: 'Explore Faith', desc: 'Ask questions and discover Jesus', color: 'bg-purple-50 text-purple-600' },
              { icon: Users, title: 'Lifelong Friendships', desc: 'Build relationships that last forever', color: 'bg-green-50 text-green-600' },
            ].map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <GlassCard hover className="h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className={`${feature.color} p-4 rounded-2xl mb-5`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-card-title font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                    <p className="text-[#64748B] leading-relaxed">{feature.desc}</p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Student Stories / Testimonials */}
      <section className="pt-30 pb-36 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16">
              <div>
                <h2 className="text-section-mobile lg:text-section font-bold text-[#0F172A]">
                  What Students Say
                </h2>
              </div>
              <Link href="/stories" className="hidden lg:inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group mt-4 lg:mt-0">
                View all stories
                <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => setActiveTestimonial(prev => Math.max(0, prev - 1))}
              disabled={activeTestimonial === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hidden lg:flex"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => setActiveTestimonial(prev => Math.min(Math.max(0, testimonials.length - 3), prev + 1))}
              disabled={activeTestimonial >= Math.max(0, testimonials.length - 3)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hidden lg:flex"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Track */}
            <div className="overflow-hidden px-1 lg:px-0">
              <div 
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {loading ? (
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] shrink-0 bg-secondary-50 rounded-[24px] p-8 animate-pulse h-80">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-secondary-200"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-5 bg-secondary-200 rounded mb-2"></div>
                          <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-secondary-200 rounded"></div>
                        <div className="h-4 bg-secondary-200 rounded"></div>
                        <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] shrink-0">
                      <div className="group relative bg-white rounded-[24px] p-8 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-2 border border-[#E5E7EB] h-full overflow-hidden">
                        {/* Top colored border */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-primary" />
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-[#0F172A]">{testimonial.name}</h3>
                          <p className="text-sm text-[#64748B]">{testimonial.program}</p>
                          <p className="text-sm text-primary-600 font-medium">Old Dominion University</p>
                          <div className="flex mt-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        
                        <Quote className="w-10 h-10 text-primary-200 mb-4" />
                        
                        <p className="text-[#475569] leading-relaxed mb-6 italic">
                          "{testimonial.testimonial}"
                        </p>
                        
                        <div className="pt-5 border-t border-[#E5E7EB]">
                          <div className="flex items-center gap-2 mb-1">
                            {testimonial.status === 'Graduate' || testimonial.status === 'Alumni' ? (
                              <GraduationCap className="w-4 h-4 text-primary-600" />
                            ) : (
                              <Award className="w-4 h-4 text-primary-600" />
                            )}
                            <span className="text-sm font-semibold text-[#0F172A]">{testimonial.currentPosition}</span>
                          </div>
                          <p className="text-xs text-[#64748B]">
                            {testimonial.status === 'Current Student' ? 'Currently at ODU' : 'ISCF Alumni'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-secondary-200" />
              ))
            ) : (
              testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-primary-600 w-6' : 'bg-secondary-200 hover:bg-secondary-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))
            )}
          </div>

          <div className="text-center mt-8 lg:hidden">
            <Link href="/about" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group">
              View all stories
              <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* Share Your Story CTA */}
          <ScrollReveal className="mt-16">
            <div className="bg-gradient-primary rounded-[32px] p-10 lg:p-14 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(37,99,235,0.25)]">
              <div className="absolute top-6 left-10 text-white/20 animate-float">
                <Heart className="w-8 h-8" />
              </div>
              <div className="absolute bottom-6 right-10 text-white/20 animate-float" style={{ animationDelay: '1s' }}>
                <Heart className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 relative z-10">
                Want to Share Your Journey?
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                We'd love to hear how ISCF has impacted your life.
              </p>
              {!showStoryForm ? (
                <>
                  {storySubmissionMessage && (
                    <p className="relative z-10 mb-5 text-lg font-semibold text-white">{storySubmissionMessage}</p>
                  )}
                  <button
                  type="button"
                  onClick={() => {
                    setShowStoryForm(true);
                    setStorySubmissionMessage(null);
                  }}
                  className="bg-white text-primary-600 hover:bg-secondary-50 relative z-10 inline-flex items-center justify-center rounded-2xl px-8 py-4 font-bold text-lg transition-colors"
                >
                  Share Your Story
                  </button>
                </>
              ) : (
                <form onSubmit={handleStorySubmit} className="relative z-10 mx-auto max-w-2xl space-y-4 text-left">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="name"
                      value={storyForm.name}
                      onChange={handleStoryInputChange}
                      required
                      placeholder="Your name"
                      className="w-full rounded-xl border border-white/40 bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <input
                      type="text"
                      name="country"
                      value={storyForm.country}
                      onChange={handleStoryInputChange}
                      required
                      placeholder="Your country"
                      className="w-full rounded-xl border border-white/40 bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <input
                    type="text"
                    name="program"
                    value={storyForm.program}
                    onChange={handleStoryInputChange}
                    required
                    placeholder="Your program or area of study"
                    className="w-full rounded-xl border border-white/40 bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <textarea
                    name="testimonial"
                    value={storyForm.testimonial}
                    onChange={handleStoryInputChange}
                    required
                    rows={6}
                    placeholder="Tell us how ISCF has impacted your life"
                    className="w-full resize-y rounded-xl border border-white/40 bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  {storySubmissionMessage && (
                    <p className="text-center font-medium text-white">{storySubmissionMessage}</p>
                  )}
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isSubmittingStory}
                      className="rounded-xl bg-white px-6 py-3 font-bold text-primary-600 transition-colors hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmittingStory ? 'Submitting...' : 'Submit Your Story'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowStoryForm(false)}
                      className="rounded-xl border border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>


    </div>
  );
}