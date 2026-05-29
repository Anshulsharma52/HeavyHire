import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Info, IndianRupee, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // Booking Modal State
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingType, setBookingType] = useState('daily'); // 'daily' or 'hourly'
  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Helper to calculate estimated price and duration
  const getEstimatedBookingPrice = () => {
    if (!selectedVehicle) return null;
    
    if (bookingType === 'daily') {
      if (!bookingDates.startDate || !bookingDates.endDate) return null;
      const start = new Date(bookingDates.startDate);
      const end = new Date(bookingDates.endDate);
      if (end < start) return { error: 'End date must be after start date' };
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return {
        durationText: `${diffDays} Day(s)`,
        total: diffDays * (selectedVehicle.pricePerDay || 0)
      };
    } else {
      if (!bookingDates.startDate || !bookingDates.startTime || !bookingDates.endTime) return null;
      const [startH, startM] = bookingDates.startTime.split(':').map(Number);
      const [endH, endM] = bookingDates.endTime.split(':').map(Number);
      let diffHours = (endH - startH) + (endM - startM) / 60;
      if (diffHours < 0) {
        diffHours += 24; // handles overnight
      }
      const duration = Math.ceil(diffHours * 100) / 100;
      return {
        durationText: `${duration} Hour(s)`,
        total: Math.ceil(duration * (selectedVehicle.pricePerHour || 0))
      };
    }
  };

  const estPriceInfo = getEstimatedBookingPrice();

  // Filters
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');

  useEffect(() => {
    fetchVehicles();
  }, [searchParams]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let query = '';
      if (searchParams.get('category')) query += `category=${searchParams.get('category')}&`;
      if (searchParams.get('location')) query += `location=${searchParams.get('location')}`;
      
      const { data } = await api.get(`/vehicles?${query}`);
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (categoryFilter) params.append('category', categoryFilter);
    if (locationFilter) params.append('location', locationFilter);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setLocationFilter('');
    setSearchParams(new URLSearchParams());
  };

  const handleBookVehicle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      await api.post('/bookings', {
        vehicleId: selectedVehicle._id,
        bookingDate: bookingDates.startDate,
        endDate: bookingType === 'daily' ? bookingDates.endDate : undefined,
        startTime: bookingType === 'hourly' ? bookingDates.startTime : undefined,
        endTime: bookingType === 'hourly' ? bookingDates.endTime : undefined,
        deliveryLocation
      });
      toast.success('Booking request sent successfully!');
      setSelectedVehicle(null);
      setBookingType('daily');
      setBookingDates({ startDate: '', endDate: '', startTime: '', endTime: '' });
      setDeliveryLocation('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book vehicle');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-primary-dark hover:text-primary">Clear all</button>
              </div>
              
              <form onSubmit={handleApplyFilters} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter city or area"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="input-field"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Truck">Truck</option>
                    <option value="JCB">JCB</option>
                    <option value="Tractor">Tractor</option>
                    <option value="Dumper">Dumper</option>
                    <option value="Crane">Crane</option>
                    <option value="Trolley">Trolley</option>
                  </select>
                </div>

                <button type="submit" className="w-full btn-primary py-3">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Vehicle Listings */}
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {vehicles.length} {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Found
              </h1>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
                <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No vehicles found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different location.</p>
                <button onClick={clearFilters} className="mt-6 btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="card flex flex-col group">
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img 
                        src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=500&q=80'} 
                        alt={vehicle.vehicleName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=500&q=80' }}
                      />
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold shadow-md text-primary-dark">
                        {vehicle.category}
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={vehicle.vehicleName}>
                        {vehicle.vehicleName}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <MapPin size={16} className="mr-1 text-primary" />
                        <span className="truncate">{vehicle.location}</span>
                      </div>
                      
                      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 mb-4">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Per Hour</div>
                          <div className="font-bold text-dark flex items-center justify-center">
                            <IndianRupee size={14} />{vehicle.pricePerHour || 'N/A'}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Per Day</div>
                          <div className="font-bold text-dark flex items-center justify-center">
                            <IndianRupee size={14} />{vehicle.pricePerDay || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="w-full btn-primary py-2 text-sm font-bold flex items-center justify-center gap-2 mt-auto"
                      >
                        View Details & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button 
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Vehicle</h2>
            <p className="text-gray-600 mb-6">{selectedVehicle.vehicleName}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedVehicle.location}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="font-bold text-primary-dark flex items-center justify-end"><IndianRupee size={14} />{selectedVehicle.pricePerHour || 'N/A'}</p>
                </div>
                <div className="text-right border-l border-gray-200 pl-6">
                  <p className="text-sm text-gray-500">Daily Rate</p>
                  <p className="font-bold text-primary-dark flex items-center justify-end"><IndianRupee size={14} />{selectedVehicle.pricePerDay}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button 
                type="button"
                onClick={() => setBookingType('daily')}
                className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${bookingType === 'daily' ? 'border-primary bg-primary/10 text-dark-darker' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
              >
                Daily Booking
              </button>
              <button 
                type="button"
                onClick={() => setBookingType('hourly')}
                className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${bookingType === 'hourly' ? 'border-primary bg-primary/10 text-dark-darker' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
              >
                Hourly Booking
              </button>
            </div>

            <form onSubmit={handleBookVehicle} className="space-y-4">
              {bookingType === 'daily' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                      value={bookingDates.startDate}
                      onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                      type="date" 
                      required
                      min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                      className="input-field"
                      value={bookingDates.endDate}
                      onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                      value={bookingDates.startDate}
                      onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input 
                        type="time" 
                        required
                        className="input-field"
                        value={bookingDates.startTime}
                        onChange={(e) => setBookingDates({...bookingDates, startTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input 
                        type="time" 
                        required
                        className="input-field"
                        value={bookingDates.endTime}
                        onChange={(e) => setBookingDates({...bookingDates, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Delivery Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter full address for delivery"
                  className="input-field"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                />
              </div>

              {estPriceInfo && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-3">
                  {estPriceInfo.error ? (
                    <p className="text-red-600 text-sm font-medium">{estPriceInfo.error}</p>
                  ) : (
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-gray-500">Estimated Duration</p>
                        <p className="font-bold text-gray-800">{estPriceInfo.durationText}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 font-medium">Estimated Cost</p>
                        <p className="font-bold text-lg text-dark-darker flex items-center justify-end">
                          <IndianRupee size={16} />{estPriceInfo.total}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={bookingLoading || (estPriceInfo && estPriceInfo.error)}
                className="w-full btn-primary py-3 mt-4 disabled:opacity-50"
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
