import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Truck, Menu, X, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-dark-darker text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl tracking-tight">Heavy<span className="text-primary">Hire</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
            {(!user || user.role !== 'owner') && (
              <Link to="/vehicles" className="hover:text-primary transition-colors font-medium">Find Vehicles</Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <UserIcon size={18} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="btn-primary">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-primary transition-colors font-medium">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-light">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-dark text-white font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {(!user || user.role !== 'owner') && (
              <Link to="/vehicles" className="block px-3 py-2 rounded-md hover:bg-dark text-white font-medium" onClick={() => setIsMenuOpen(false)}>Find Vehicles</Link>
            )}
            
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md hover:bg-dark text-white font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md hover:bg-dark text-primary font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-dark text-white font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md hover:bg-dark text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
