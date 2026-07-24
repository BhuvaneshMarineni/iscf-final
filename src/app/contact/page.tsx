'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, Heart } from 'lucide-react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);
    setSubmissionError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          newsletter: formData.get('newsletter') === 'on',
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Unable to send your message');
      }

      form.reset();
      setSubmissionMessage('Thank you! Your message has been sent. We will get back to you soon.');
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to send your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Contact Us</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We'd love to hear from you! Reach out with questions, to get involved, 
              or just to say hello. Our doors are always open.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heart className="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-lg text-gray-600">Multiple ways to connect with our community</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-teal-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Us</h3>
                <p className="text-gray-600 mb-4">Send us a message anytime</p>
                <a 
                  href="mailto:info@iscfodu.org" 
                  className="text-teal-600 hover:text-teal-700 font-medium text-lg"
                >
                  Gopal@iscf.global
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-500">
                <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Call Us</h3>
                <p className="text-gray-600 mb-4">Speak with us directly</p>
                <a 
                  href="tel:+1-757-XXX-XXXX" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                >
                  (757) 270-2823
                </a>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-green-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Visit Us</h3>
                <p className="text-gray-600 mb-4">Find us on campus</p>
                <p className="text-green-600 font-medium">
                  Old Dominion University<br />
                  Norfolk, VA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Send className="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you soon</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="(757) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="student">I'm a Student - Want to Join</option>
                    <option value="volunteer">I Want to Volunteer</option>
                    <option value="church">Church Partnership</option>
                    <option value="events">Questions About Events</option>
                    <option value="leadership">Leadership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-vertical"
                    placeholder="Tell us how we can help you or how you'd like to get involved..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                    I'd like to receive updates about ISCF events and programs
                  </label>
                </div>

                {submissionMessage && (
                  <p className="text-center font-medium text-green-600">{submissionMessage}</p>
                )}
                {submissionError && (
                  <p className="text-center font-medium text-red-600">{submissionError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-6 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 font-semibold text-lg shadow-lg flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Clock className="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quick Information</h2>
              <p className="text-lg text-gray-600">Everything you need to know to connect with us</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Calendar className="w-10 h-10 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Weekly Bible Study</h3>
                <p className="text-gray-700 mb-2">
                  <strong>When:</strong> Every Thursday<br />
                  <strong>Time:</strong> 7:00 PM - 8:00 PM
                </p>
                <p className="text-teal-600 font-medium">All students welcome!</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <MapPin className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Campus Location</h3>
                <p className="text-gray-700 mb-2">
                  Old Dominion University<br />
                  Norfolk, Virginia
                </p>
                <p className="text-blue-600 font-medium">Weekly campus meetings</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Heart className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Response Time</h3>
                <p className="text-gray-700 mb-2">
                  We typically respond to emails<br />
                  within 24-48 hours
                </p>
                <p className="text-red-500 font-medium">We're here to help!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Follow Us Online</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Stay connected with our community and get updates on events, programs, and stories 
                  from our international student family.
                </p>
                
                <div className="space-y-4">
                  <a 
                    href="#" 
                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold">f</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Facebook</h3>
                      <p className="text-gray-600">Follow us for event updates and photos</p>
                    </div>
                  </a>

                  <a 
                    href="#" 
                    className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold">@</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Instagram</h3>
                      <p className="text-gray-600">See photos from our community events</p>
                    </div>
                  </a>

                  <a 
                    href="#" 
                    className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                  >
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp Group</h3>
                      <p className="text-gray-600">Join our student community chat</p>
                    </div>
                  </a>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us on Campus</h2>
                <div className="bg-gray-100 rounded-xl p-8 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-teal-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Old Dominion University</h3>
                  <p className="text-gray-700 mb-6">
                    We meet regularly on the ODU campus. Contact us for specific meeting locations 
                    and directions to our events.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-2">
                      <strong>Address:</strong><br />
                      Old Dominion University<br />
                      Norfolk, VA 23529
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}