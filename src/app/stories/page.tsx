'use client';

import { useEffect, useState } from 'react';
import { getTestimonials } from '@/lib/api';
import type { Testimonial } from '@/lib/api';
import { Quote, MapPin, GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Stories() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load student stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Student Stories</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Real stories of faith, friendship, and transformation from students around the world
            </p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-300" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-300 rounded w-32" />
                      <div className="h-4 bg-gray-300 rounded" />
                      <div className="h-4 bg-gray-300 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Quote className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            {testimonial.country}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            {testimonial.program}
                          </span>
                        </div>
                      </div>

                      <blockquote className="text-gray-700 leading-relaxed italic flex-1">
                        &ldquo;{testimonial.testimonial}&rdquo;
                      </blockquote>

                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-blue-600">{testimonial.currentPosition}</p>
                        <p className="text-sm text-gray-500">{testimonial.status} • {testimonial.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
