import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, MessageCircle, Users, Calendar, Globe, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/events', label: 'Events' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/contact', label: 'Contact' },
    { href: '/gallery', label: 'Gallery' },
  ];

  const supportLinks = [
    { href: '/contact', label: 'Donate' },
    { href: '/get-involved', label: 'Volunteer' },
    { href: '/get-involved', label: 'Partner with Us' },
    { href: '/contact', label: 'Prayer Requests' },
  ];

  const resourcesLinks = [
    { href: '/about', label: 'Our Story' },
    { href: '/events', label: 'Upcoming Events' },
    { href: '/gallery', label: 'Photo Gallery' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <footer className="bg-gradient-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* ISCF Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Logo showText={false} />
              </div>
              <div>
                <h3 className="text-xl font-bold">ISCF</h3>
                <p className="text-sm text-white/70">International Student Christian Fellowship</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Serving international students at Old Dominion University since 1995. 
              Building bridges of friendship, faith, and community across cultures.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-white/60 text-sm">
                <Users className="w-4 h-4 mr-3 text-primary-400" />
                <span>20,000+ Students Served</span>
              </div>
              <div className="flex items-center text-white/60 text-sm">
                <Calendar className="w-4 h-4 mr-3 text-primary-400" />
                <span>29 Years of Ministry</span>
              </div>
              <div className="flex items-center text-white/60 text-sm">
                <Globe className="w-4 h-4 mr-3 text-primary-400" />
                <span>100+ Countries</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Support & Get Involved</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-white/70 text-sm">
                <Mail className="w-4 h-4 mr-3 text-primary-400" />
                <a href="mailto:info@iscfodu.org" className="hover:text-primary-400 transition-colors">
                  info@iscfodu.org
                </a>
              </div>
              <div className="flex items-center text-white/70 text-sm">
                <Phone className="w-4 h-4 mr-3 text-primary-400" />
                <a href="tel:+1-757-XXX-XXXX" className="hover:text-primary-400 transition-colors">
                  (757) XXX-XXXX
                </a>
              </div>
              <div className="flex items-center text-white/70 text-sm">
                <MapPin className="w-4 h-4 mr-3 text-primary-400" />
                <span>Old Dominion University<br />Norfolk, VA</span>
              </div>
            </div>

            <h4 className="text-white font-medium text-sm mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/iscfodu"
                className="text-white/70 hover:text-primary-400 hover:bg-white/10 transition-all p-3 rounded-xl"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/iscfodu"
                className="text-white/70 hover:text-primary-400 hover:bg-white/10 transition-all p-3 rounded-xl"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/17571234567"
                className="text-white/70 hover:text-primary-400 hover:bg-white/10 transition-all p-3 rounded-xl"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/5 rounded-3xl p-8 mb-12 backdrop-blur-sm border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
              <p className="text-white/70 text-sm">
                Subscribe to our newsletter for updates on events and stories from our community.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button variant="primary" size="md">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © {currentYear} ISCF - International Student Christian Fellowship. All rights reserved.
            </p>
            <div className="flex items-center text-white/50 text-xs">
              <Heart className="w-4 h-4 mr-2 text-red-400" />
              <span>Made with love for international students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;