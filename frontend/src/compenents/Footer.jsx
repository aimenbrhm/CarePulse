import React from 'react';
import { Mail, Phone, ChevronRight, Facebook, Twitter, Instagram, Linkedin, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-16 pb-6 dark:bg-gray-900 dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            {/* Logo placeholder instead of importing from assets */}
            <div className="h-12 mb-6 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CarePulse</span>
              <span className="text-xl font-light text-gray-800 dark:text-gray-400">Health</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              CarePulse provides innovative healthcare solutions designed to improve patient outcomes and streamline medical processes. Our commitment to excellence drives everything we do.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-700 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-200">Quick Links</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">About Us</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <span className="text-gray-400">Services</span>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <Link to="/reviews" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Testimonials</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-200">Resources</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Blog</Link>
              </li>



              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <span className="text-gray-400">Case Studies</span>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <span className="text-gray-400">Privacy Policy</span>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <span className="text-gray-400">Terms of Service</span>
              </li>
              <li className="flex items-center">
                <ChevronRight size={16} className="text-blue-500 dark:text-blue-400 mr-2" />
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-200">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="text-blue-500 dark:text-blue-400 mr-3 mt-1" />
                <a href="tel:4155550132" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  (415) 555‑0132
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-500 dark:text-blue-400 mr-3 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">54709 Willms Station, Suite 350</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-blue-500 dark:text-blue-400 mr-3 mt-1" />
                <a href="mailto:brahmiaaimen670@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  brahmiaaimen670@gmail.com
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-400 mt-4">
                123 Healthcare Avenue<br />
                Medical District<br />
                Wellness City, WC 54321
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">Subscribe to our Newsletter</h3>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with our latest news and offers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            &copy; {currentYear} CarePulse. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;