'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Heart, Calendar, Clock, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/* ─── Ticker data ─────────────────────────────────────────────────── */
const TICKER_EVENTS = [
  { title: 'Spring Welcome Banquet', date: 'March 15, 2024', time: '6:00 PM – 9:00 PM', location: 'University Center' },
  { title: 'Weekly Bible Study',     date: 'Every Thursday',  time: '7:00 PM – 8:00 PM', location: 'ODU Campus'         },
  { title: 'Cultural Night',         date: 'April 20, 2024',  time: '5:00 PM – 8:00 PM', location: 'Webb Center'        },
];

const Separator = () => (
  <span className="mx-7 opacity-35 select-none text-base">|</span>
);

const TickerItem = ({ title, date, time, location }: typeof TICKER_EVENTS[0]) => (
  <span className="inline-flex items-center whitespace-nowrap">
    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
    <span className="font-semibold">{title}</span>
    <Separator />
    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-75" />
    <span className="opacity-90">{date}</span>
    <Separator />
    <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-75" />
    <span className="opacity-90">{time}</span>
    <Separator />
    <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-75" />
    <span className="opacity-90">{location}</span>
    <span className="mx-16 opacity-20 select-none">━━━━━━</span>
  </span>
);

/* ─── Hysteresis thresholds ───────────────────────────────────────── */
const ACTIVATE_PX   = 80;
const DEACTIVATE_PX = 20;
const STRIP_H       = 48;

/* ─── Component ──────────────────────────────────────────────────── */
const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isDarkMode, setIsDarkMode]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (!scrolledRef.current && y > ACTIVATE_PX) {
        scrolledRef.current = true;
        setScrolled(true);
      } else if (scrolledRef.current && y <= DEACTIVATE_PX) {
        scrolledRef.current = false;
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/contact', label: 'Contact' },
  ];

  /* Derived style values — all transition via CSS duration-300 */
  const navFontSize   = scrolled ? 15 : 16;
  const navGap        = scrolled ? 4  : 8;   /* gap between items (px, via gap class override) */
  const donateHeight  = scrolled ? 42 : 52;
  const donatePx      = scrolled ? 20 : 28;
  const headerHeight  = scrolled ? 72 : 96;
  const headerPaddingY = scrolled ? 12 : 20;
  const headerPaddingX = scrolled ? 40 : 48;

  return (
    <div className="sticky top-0 z-50 overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          ANNOUNCEMENT STRIP — slides up on scroll, back on return
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="w-full text-white"
        style={{
          height: STRIP_H,
          background: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)',
          marginTop: scrolled ? -STRIP_H : 0,
          opacity: scrolled ? 0 : 1,
          transition: 'margin-top 300ms ease, opacity 300ms ease',
          pointerEvents: scrolled ? 'none' : 'auto',
          willChange: 'margin-top, opacity',
        }}
      >
        <div className="flex items-center h-[48px]">
          {/* Left icon */}
          <div className="shrink-0 pl-6 pr-3 z-10 flex items-center">
            <Calendar className="w-4 h-4 opacity-80" />
          </div>

          {/* Scrolling track */}
          <div
            className="flex-1 overflow-hidden relative"
            onMouseEnter={() => setTickerPaused(true)}
            onMouseLeave={() => setTickerPaused(false)}
          >
            {/* Fade masks */}
            <div className="absolute left-0 top-0 h-full w-8 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #2563EB, transparent)' }} />
            <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #1D4ED8, transparent)' }} />

            {/* Doubled ticker — seamless loop */}
            <div
              className="flex items-center text-[15px] font-medium animate-ticker"
              style={{
                animationPlayState: tickerPaused ? 'paused' : 'running',
                willChange: 'transform',
              }}
            >
              {TICKER_EVENTS.map((ev, i) => <TickerItem key={`a${i}`} {...ev} />)}
              {TICKER_EVENTS.map((ev, i) => <TickerItem key={`b${i}`} {...ev} />)}
            </div>
          </div>

          {/* Fixed right CTA */}
          <div className="shrink-0 pl-4 pr-6 z-10">
            <Link
              href="/events"
              className="text-[14px] font-semibold bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN NAVBAR
      ═══════════════════════════════════════════════════════════ */}
      <header
        style={{
          height: headerHeight,
          paddingTop: headerPaddingY,
          paddingBottom: headerPaddingY,
          background: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(229,231,235,0.8)' : '#E5E7EB'}`,
          boxShadow: scrolled
            ? '0 12px 35px rgba(15,23,42,0.12)'
            : '0 4px 20px rgba(15,23,42,0.05)',
          transition: 'all 300ms ease',
          willChange: 'height, box-shadow, background',
        }}
        className="w-full"
      >
        <div
          className="max-w-[1440px] mx-auto h-full flex items-center justify-between"
          style={{
            paddingLeft: headerPaddingX,
            paddingRight: headerPaddingX,
            transition: 'padding 300ms ease',
          }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo showText scrolled={scrolled} />
          </Link>

          {/* Center Nav */}
          <nav
            className="hidden lg:flex items-center"
            style={{ gap: navGap, transition: 'gap 300ms ease' }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full font-medium transition-all duration-200 px-4 py-2 ${
                  pathname === item.href
                    ? 'text-[#1D4ED8] bg-[#EEF2FF]'
                    : 'text-[#374151] hover:text-[#1D4ED8] hover:bg-[#F0F4FF]'
                }`}
                style={{ fontSize: navFontSize, transition: 'font-size 300ms ease, background 200ms ease, color 200ms ease' }}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-[#1D4ED8] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 text-white font-semibold text-sm rounded-2xl hover:-translate-y-px"
              style={{
                height: donateHeight,
                paddingLeft: donatePx,
                paddingRight: donatePx,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.30)',
                transition: 'height 300ms ease, padding 300ms ease, transform 200ms ease',
              }}
            >
              <Heart className="w-4 h-4 fill-white shrink-0" />
              Donate
            </Link>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full hover:bg-[#F1F5F9] transition-colors text-[#64748B]"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-full hover:bg-[#F1F5F9] transition-colors text-[#64748B]"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE DRAWER
      ═══════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <Logo showText />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
            <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-[#1D4ED8] bg-[#EEF2FF]'
                      : 'text-[#374151] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-[#E5E7EB]">
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-white font-semibold py-3.5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
              >
                <Heart className="w-4 h-4 fill-white" />
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;