'use client';

import Link from 'next/link';
import { Users, Heart, Globe, Calendar, Award, MapPin, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Story Since 1995</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Nearly three decades of serving international students with love, friendship, and faith
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heart className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
              <p className="text-lg text-gray-600">Our purpose and calling since 1995</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-blue-500">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <Heart className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <div className="p-6">
                  <p className="text-lg text-gray-700 leading-relaxed italic font-medium">
                    "Connecting international students with American families in friendship, faith, and community."
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                  <Users className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our mission is to connect international students with American families and individuals 
                    in authentic friendship, Christian faith, and supportive community. We seek to provide 
                    a welcoming environment where students can experience the love of Jesus, explore life's 
                    big questions, and build lasting relationships that cross cultures and generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600">From humble beginnings to serving over 20,000 students</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-purple-500">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                  <Calendar className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-bold">The Beginning (1995)</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    The ministry was founded in 1995 to welcome and serve international students who are 
                    studying at Old Dominion University. We were pioneers in serving international students 
                    at the Old Dominion University Campus. We worked with local American families and churches 
                    in the area to serve the global student community.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-teal-500">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white">
                  <Users className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-bold">Growing Community</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Many events were organized annually to provide an avenue for individuals and families, 
                    and students to connect. We had large Welcome Banquets in the Fall, where at times more 
                    than 1000 students and families attended the event. Welcome Banquets were the main event 
                    of the year. This took place in the Fall.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-orange-500">
                <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-6 text-white">
                  <Globe className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-bold">Expanding Programs</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Besides the Welcome Banquets, we also had other smaller events that were country-specific. 
                    We developed Free English Classes, Free Giveaways, Bible Studies and Leadership Training 
                    programs to better serve the diverse needs of our international student community.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-indigo-500">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
                  <Award className="w-10 h-10 mb-4" />
                  <h3 className="text-2xl font-bold">Our Impact Today</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">
                    ISCF has served more than 20,000 international students since 1995!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Leadership */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Award className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Founding Leadership</h2>
              <p className="text-lg text-gray-600">Dedicated founders who continue to serve with passion</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Founding Story</h3>
              <p className="text-gray-700 leading-relaxed">
                The International Student Christian Fellowship was initially founded by Dr. Gopal Kunji Kanan, 
                his wife, Daisy Edward, and Lew Belcourt, along with his wife, Monica. We pioneered the work 
                together until 1998, when Lew and his wife left for Indonesia as missionaries. Dr. Gopal and 
                Daisy continue the work to this day.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-blue-500">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/Gopal.JPG"
                    alt="Dr. Gopal Kunji Kanan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. Gopal Kunji Kanan</h3>
                  <p className="text-blue-600 mb-4 font-medium">Co-Founder & Director</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm font-medium">Originally from Malaysia</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <GraduationCap className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm font-medium">Doctorate from Regent University</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-sm mb-4">
                    Dr. Gopal enrolled at Regent University, where he earned his two Master's and Doctorate. 
                    While in Malaysia, Dr. Gopal earned a degree in Biochemistry with Honors. He worked many 
                    years as a Biochemist before leaving for the US.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Being an international himself, Dr. Gopal understands the challenges and needs of the 
                    international and immigrant community. He can relate well with the internationals and 
                    is better positioned to connect international students with local American families.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/Daisy.png"
                    alt="Daisy Edward"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Daisy Edward</h3>
                  <p className="text-green-600 mb-4 font-medium">Co-Founder & Director</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-3 text-green-600" />
                      <span className="text-sm font-medium">Originally from Malaysia</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Heart className="w-4 h-4 mr-3 text-green-600" />
                      <span className="text-sm font-medium">Ministry & Hospitality Leader</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-sm mb-4">
                    Daisy Edward has been instrumental in building the warm, welcoming community that ISCF 
                    is known for. Her heart for hospitality and cross-cultural ministry has touched thousands 
                    of international students over the years.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Together with Dr. Gopal, Daisy started the outreach while still studying at the University. 
                    Their personal experience as international students gives them unique insight into the 
                    needs and challenges faced by today's international student community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
              <p className="text-lg text-gray-600">Dedicated leaders serving alongside our founders</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-purple-500">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                  <BookOpen className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold">Sarah Johnson</h3>
                  <p className="text-purple-100">Ministry Coordinator</p>
                </div>
                <div className="p-6">
                  <div className="aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src="https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Coordinates weekly Bible studies and special events, ensuring every international 
                    student feels welcomed and supported in their faith journey.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-teal-500">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white">
                  <Users className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold">Michael Chen</h3>
                  <p className="text-teal-100">Volunteer Coordinator</p>
                </div>
                <div className="p-6">
                  <div className="aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Michael Chen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Manages our volunteer network, matching American families with international 
                    students and coordinating training programs for new volunteers.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-orange-500">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
                  <MapPin className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold">Maria Rodriguez</h3>
                  <p className="text-orange-100">Campus Outreach Director</p>
                </div>
                <div className="p-6">
                  <div className="aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src="https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Maria Rodriguez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Leads our presence on ODU campus, building relationships with international 
                    student services and organizing campus-based activities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Leadership Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Student Leadership Team</h2>
              <p className="text-lg text-gray-600">International students leading and serving their community</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Developing Tomorrow's Leaders</h3>
              <p className="text-gray-700 leading-relaxed">
                Our Student Leadership Team consists of international students who have grown in their 
                leadership abilities through ISCF programs. They serve as mentors, event coordinators, 
                and bridges between new students and our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-blue-500">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Ahmed Hassan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Ahmed Hassan</h3>
                  <p className="text-blue-600 text-sm mb-3 font-medium">President</p>
                  <div className="flex items-center mb-3">
                    <Globe className="w-3 h-3 text-blue-600 mr-2" />
                    <span className="text-gray-700 text-xs font-medium">Egypt • Engineering</span>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Leads student initiatives and represents international student voices in ISCF programs.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Priya Sharma"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Priya Sharma</h3>
                  <p className="text-green-600 text-sm mb-3 font-medium">Vice President</p>
                  <div className="flex items-center mb-3">
                    <Globe className="w-3 h-3 text-green-600 mr-2" />
                    <span className="text-gray-700 text-xs font-medium">India • Business</span>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Coordinates welcome events and mentors new international students.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-yellow-500">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Carlos Silva"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Carlos Silva</h3>
                  <p className="text-yellow-600 text-sm mb-3 font-medium">Events Coordinator</p>
                  <div className="flex items-center mb-3">
                    <Globe className="w-3 h-3 text-yellow-600 mr-2" />
                    <span className="text-gray-700 text-xs font-medium">Brazil • Computer Science</span>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Plans cultural celebrations and organizes campus outreach activities.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-purple-500">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Li Wei"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Li Wei</h3>
                  <p className="text-purple-600 text-sm mb-3 font-medium">Communications Lead</p>
                  <div className="flex items-center mb-3">
                    <Globe className="w-3 h-3 text-purple-600 mr-2" />
                    <span className="text-gray-700 text-xs font-medium">China • Marketing</span>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Manages social media and helps with cross-cultural communication.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Leadership Development</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Monthly leadership training sessions</li>
                  <li>• Cross-cultural communication workshops</li>
                  <li>• Event planning and management experience</li>
                  <li>• Mentoring and support skills development</li>
                  <li>• Public speaking and presentation opportunities</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Leader Responsibilities</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Welcome and orient new international students</li>
                  <li>• Assist with Bible study and campus meetings</li>
                  <li>• Plan and execute cultural celebration events</li>
                  <li>• Serve as liaisons with university administration</li>
                  <li>• Mentor younger students in their academic journey</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Interested in Student Leadership?</h4>
              <p className="text-gray-700 mb-6">
                If you're an international student interested in developing your leadership skills while 
                serving your community, we'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg inline-flex items-center justify-center"
                >
                  Apply for Leadership <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/get-involved"
                  className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}