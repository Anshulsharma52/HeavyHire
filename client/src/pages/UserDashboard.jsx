import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { LogOut, Settings, Calendar, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('bookingStatusUpdate', (updatedBooking) => {
        if (updatedBooking.userId === user._id) {
          toast.success(`Booking status updated to ${updatedBooking.status}!`);
          setUserBookings(prev => prev.map(b => b._id === updatedBooking._id ? { ...b, status: updatedBooking.status } : b));
        }
      });
      return () => {
        socket.off('bookingStatusUpdate');
      };
    }
  }, [socket, user._id]);

  const fetchUserData = async () => {
    try {
      const { data } = await api.get('/bookings/mybookings');
      setUserBookings(data);
    } catch (error) {
      toast.error('Failed to load user bookings');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      try {
        await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-dark text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 capitalize">{user?.role}</p>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'overview' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Activity size={20} /> Overview
              </button>
              <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'bookings' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Calendar size={20} /> My Bookings
              </button>
              <button onClick={() => navigate('/vehicles')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-100 transition-colors">
                <Search size={20} /> Find Vehicles
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'settings' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Settings size={20} /> Profile Settings
              </button>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 mt-4 transition-colors">
                <LogOut size={20} /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {user?.name}!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-blue-800 font-bold mb-2">Total Bookings</h3>
                    <p className="text-3xl font-extrabold text-blue-900">{userBookings.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-green-800 font-bold mb-2">Active Rentals</h3>
                    <p className="text-3xl font-extrabold text-green-900">
                      {userBookings.filter(b => b.status === 'accepted').length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                {userBookings.length === 0 ? (
                  <p className="text-gray-500">You have no bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map(booking => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{booking.vehicleId?.vehicleName || 'Unknown Vehicle'}</h4>
                          {booking.vehicleId?.ownerId && (
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                              <p className="font-semibold text-gray-900 mb-1">Owner Contact:</p>
                              <p>{booking.vehicleId.ownerId.name} | {booking.vehicleId.ownerId.phone || 'No phone'} | {booking.vehicleId.ownerId.email}</p>
                            </div>
                          )}
                          <p className="text-gray-500 text-sm mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                            {booking.startTime && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </span>
                            )}
                            {!booking.startTime && !booking.duration && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-bold">Daily</span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelBooking(booking._id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium underline"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="input-field bg-gray-50" value={user?.name} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="input-field bg-gray-50" value={user?.email} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" className="input-field bg-gray-50" value={user?.phone || 'Not provided'} readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
