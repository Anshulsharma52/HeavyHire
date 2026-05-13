import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { LogOut, Users, Settings, Calendar, Truck, Activity } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalVehicles: 0, totalBookings: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newBooking', (booking) => {
        toast.success(`New booking made on the platform!`);
        setAllBookings(prev => [booking, ...prev]);
        setStats(prev => ({ ...prev, totalBookings: prev.totalBookings + 1 }));
      });

      socket.on('bookingStatusUpdate', (updatedBooking) => {
        setAllBookings(prev => prev.map(b => b._id === updatedBooking._id ? { ...b, status: updatedBooking.status } : b));
      });

      return () => {
        socket.off('newBooking');
        socket.off('bookingStatusUpdate');
      };
    }
  }, [socket]);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setAllUsers(usersRes.data);

      const bookingsRes = await api.get('/admin/bookings');
      setAllBookings(bookingsRes.data);

      const vehiclesRes = await api.get('/vehicles'); // using standard public route
      setAllVehicles(vehiclesRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
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

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success("User deleted successfully");
        fetchAdminData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
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
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-red-500 font-bold uppercase text-sm mt-1">{user?.role}</p>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'overview' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Activity size={20} /> Overview
              </button>
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'users' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Users size={20} /> Manage Users
              </button>
              <button onClick={() => setActiveTab('vehicles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'vehicles' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Truck size={20} /> Manage Vehicles
              </button>
              <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'bookings' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Calendar size={20} /> Platform Bookings
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Control Panel</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-blue-800 font-bold mb-2">Total Users</h3>
                    <p className="text-3xl font-extrabold text-blue-900">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-green-800 font-bold mb-2">Total Vehicles</h3>
                    <p className="text-3xl font-extrabold text-green-900">{stats.totalVehicles}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-purple-800 font-bold mb-2">Total Bookings</h3>
                    <p className="text-3xl font-extrabold text-purple-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allUsers.map((u) => (
                        <tr key={u._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-800' : u.role === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {u.role !== 'admin' && (
                              <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-900">Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Vehicles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allVehicles.map(vehicle => (
                    <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{vehicle.vehicleName}</h4>
                        <p className="text-sm text-gray-500">{vehicle.category} • {vehicle.location}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">
                        ₹{vehicle.pricePerDay}/d
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Bookings</h2>
                <div className="space-y-4">
                  {allBookings.map(booking => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4 bg-white shadow-sm hover:shadow transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 mb-3">
                          {booking.vehicleId?.vehicleName || 'Unknown Vehicle'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded border border-blue-100 text-sm">
                            <p className="font-bold text-blue-900 mb-1 flex items-center gap-2"><Users size={14}/>Customer Info</p>
                            <p className="text-gray-700">Name: <span className="font-medium">{booking.userId?.name || 'N/A'}</span></p>
                            <p className="text-gray-700">Phone: <span className="font-medium">{booking.userId?.phone || 'N/A'}</span></p>
                            <p className="text-gray-700">Email: <span className="font-medium">{booking.userId?.email || 'N/A'}</span></p>
                          </div>
                          
                          <div className="bg-green-50 p-3 rounded border border-green-100 text-sm">
                            <p className="font-bold text-green-900 mb-1 flex items-center gap-2"><Users size={14}/>Owner Info</p>
                            <p className="text-gray-700">Name: <span className="font-medium">{booking.vehicleId?.ownerId?.name || 'N/A'}</span></p>
                            <p className="text-gray-700">Phone: <span className="font-medium">{booking.vehicleId?.ownerId?.phone || 'N/A'}</span></p>
                            <p className="text-gray-700">Email: <span className="font-medium">{booking.vehicleId?.ownerId?.email || 'N/A'}</span></p>
                          </div>
                        </div>
                      </div>
                        <div className="flex flex-col items-end justify-center min-w-[120px] gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          <div className="text-right text-xs text-gray-500">
                            <p className="font-medium flex items-center justify-end gap-1"><Calendar size={12}/> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            {booking.startTime && (
                              <p className="mt-1 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </p>
                            )}
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
