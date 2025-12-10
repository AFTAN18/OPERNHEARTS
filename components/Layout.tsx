import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, Globe, Instagram, Twitter, Linkedin, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isHome = location.pathname === '/';
  // Navbar is transparent only on Home page when not scrolled
  const isTransparent = isHome && !isScrolled;

  const textColorClass = isTransparent ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-primary-500';
  const logoTextClass = isTransparent ? 'text-white' : 'text-slate-900';
  const iconClass = isTransparent ? 'text-white' : 'text-slate-600';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isTransparent ? 'bg-white/80 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            {!isHome && (
                <button 
                    onClick={() => navigate(-1)}
                    className={`p-2 rounded-full transition-colors ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <Heart size={24} fill="currentColor" className="text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${logoTextClass}`}>
                OpenHearts
            </span>
            </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${textColorClass} ${location.pathname === link.path ? 'text-primary-500 font-semibold' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/donate">
            <Button size="sm" variant="accent" className="font-bold text-black">
              Donate Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${iconClass}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-medium text-slate-700 py-2 border-b border-slate-50"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/donate" onClick={() => setIsMobileOpen(false)}>
                <Button className="w-full font-bold text-black" variant="accent">Donate Now</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600" />
      
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Heart className="text-red-500" fill="currentColor" />
              <span className="text-xl font-bold">OpenHearts</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering communities through innovation, transparency, and global cooperation. Join us in building a better tomorrow.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin, Globe].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Programs</h4>
            <ul className="space-y-4">
              {['Disaster Relief', 'Education First', 'Clean Water', 'Health Initiatives'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Get Involved</h4>
            <ul className="space-y-4">
              {['Volunteer', 'Partner with Us', 'Corporate Giving', 'Careers'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Newsletter</h4>
            <p className="mb-4 text-sm">Stay updated with our latest impact stories.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-slate-800 border-none rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2024 OpenHearts NGO. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};