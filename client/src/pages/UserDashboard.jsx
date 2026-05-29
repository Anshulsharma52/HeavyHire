import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { LogOut, Settings, Calendar, Activity, Search, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userBookings, setUserBookings] = useState([]);

  // Profile Settings form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const { data } = await api.put('/auth/profile', profileForm);
      updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const totalSpent = userBookings
    .filter(b => b.status === 'accepted' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="text-yellow-800 font-bold mb-2">Total Spent (Rentals)</h3>
                    <p className="text-3xl font-extrabold text-yellow-900 flex items-center">
                      <IndianRupee size={24} className="mr-1" />{totalSpent}
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
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start md:items-center hover:shadow-md transition-shadow">
                        <div className="flex-grow">
                          <h4 className="font-bold text-lg text-gray-900">{booking.vehicleId?.vehicleName || 'Unknown Vehicle'}</h4>
                          {booking.vehicleId?.ownerId && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                              <span className="font-semibold text-gray-900 mr-1">Owner Contact:</span>
                              {booking.vehicleId.ownerId.name} | {booking.vehicleId.ownerId.phone || 'No phone'} | {booking.vehicleId.ownerId.email}
                            </div>
                          )}
                          <p className="text-gray-500 text-xs mt-2 flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                            {booking.startTime && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">
                                Hourly: {formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({booking.duration || 0} hrs)
                              </span>
                            )}
                            {!booking.startTime && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-bold">
                                Daily ({booking.duration || 0} days)
                              </span>
                            )}
                          </p>
                          {booking.deliveryLocation && (
                            <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100 max-w-xl">
                              <span className="font-semibold text-gray-900 mr-1">Delivery Location:</span>
                              {booking.deliveryLocation}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          <span className="text-sm font-bold text-gray-900 flex items-center">
                            Total: <IndianRupee size={12} className="ml-1" />{booking.totalAmount || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-primary text-dark-darker font-bold rounded-lg hover:bg-primary transition-colors text-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                      readOnly={!isEditing}
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      required 
                      className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                      readOnly={!isEditing}
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="text" 
                      required 
                      className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                      readOnly={!isEditing}
                      value={profileForm.phone} 
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-4 mt-4">
                      <button 
                        type="submit" 
                        disabled={updatingProfile} 
                        className="flex-1 btn-primary py-2.5 disabled:opacity-50 text-sm font-bold"
                      >
                        {updatingProfile ? 'Updating...' : 'Update Profile'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setProfileForm({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || ''
                          });
                          setIsEditing(false);
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
