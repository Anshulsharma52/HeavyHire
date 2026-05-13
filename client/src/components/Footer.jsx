import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-darker text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl text-white tracking-tight">Heavy<span className="text-primary">Hire</span></span>
            </Link>
            <p className="text-sm mt-4 text-gray-400">
              The premier marketplace for renting heavy machinery and vehicles. Reliable equipment for your construction and farming needs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/vehicles" className="hover:text-primary transition-colors">Find Vehicles</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/vehicles?category=Truck" className="hover:text-primary transition-colors">Trucks</Link></li>
              <li><Link to="/vehicles?category=JCB" className="hover:text-primary transition-colors">JCBs</Link></li>
              <li><Link to="/vehicles?category=Tractor" className="hover:text-primary transition-colors">Tractors</Link></li>
              <li><Link to="/vehicles?category=Crane" className="hover:text-primary transition-colors">Cranes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                <span>Gulab Bhagh near Bus stand, Dholpur, Rajasthan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <span>+91 8058928399</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <span>support@heavyhire.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HeavyHire. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
