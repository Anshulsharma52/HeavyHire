import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Clock, Settings } from 'lucide-react';

const categories = [
  { name: 'Truck', icon: '🚚', color: 'bg-blue-100' },
  { name: 'JCB', icon: '🚜', color: 'bg-yellow-100' },
  { name: 'Tractor', icon: '🚜', color: 'bg-green-100' },
  { name: 'Dumper', icon: '🚛', color: 'bg-orange-100' },
  { name: 'Crane', icon: '🏗️', color: 'bg-red-100' },
  { name: 'Trolley', icon: '🛒', color: 'bg-purple-100' },
];

const Home = () => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-dark-darker text-white py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081600-33dbd81e05d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Find the Right <span className="text-primary">Heavy Machinery</span> for Your Job
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Rent Trucks, JCBs, Tractors, and more. Reliable equipment from verified owners near you.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter location (e.g., Mumbai)"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 outline-none transition-all"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 outline-none transition-all appearance-none bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-primary hover:bg-primary-dark text-dark-darker font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Search size={20} />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-4 text-lg text-gray-600">Find exactly what you need from our wide range of machinery</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                to={`/vehicles?category=${cat.name}`}
                key={cat.name}
                className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary"
              >
                <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-primary-dark w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Owners</h3>
              <p className="text-gray-600">All equipment owners are verified to ensure you get reliable service.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="text-primary-dark w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Booking</h3>
              <p className="text-gray-600">Rent by the hour or by the day depending on your project needs.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Settings className="text-primary-dark w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Well Maintained</h3>
              <p className="text-gray-600">Machinery is regularly serviced to prevent downtime on your job.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
