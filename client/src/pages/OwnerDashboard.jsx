import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { LogOut, Settings, Calendar, Truck, PlusCircle, Activity } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [ownerVehicles, setOwnerVehicles] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  
  // Edit Vehicle State
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    vehicleName: '',
    category: '',
    location: '',
    pricePerHour: '',
    pricePerDay: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newBooking', (booking) => {
        if (booking.vehicleId?.ownerId === user._id) {
          toast.success(`New booking request from ${booking.userId?.name}!`);
          setOwnerBookings(prev => [booking, ...prev]);
        }
      });
      return () => {
        socket.off('newBooking');
      };
    }
  }, [socket, user._id]);

  const fetchOwnerData = async () => {
    try {
      const vehiclesRes = await api.get('/vehicles');
      const myVehicles = vehiclesRes.data.filter(v => v.ownerId?._id === user._id);
      setOwnerVehicles(myVehicles);

      const bookingsRes = await api.get('/bookings/owner');
      setOwnerBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to load owner data');
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

  const handleBookingAction = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchOwnerData(); // Refresh bookings
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
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
                <Activity size={20} /> Dashboard
              </button>
              <button onClick={() => setActiveTab('vehicles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'vehicles' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Truck size={20} /> My Vehicles
              </button>
              <button onClick={() => setActiveTab('add-vehicle')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'add-vehicle' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <PlusCircle size={20} /> Add Vehicle
              </button>
              <button onClick={() => setActiveTab('owner-bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'owner-bookings' ? 'bg-primary text-dark-darker font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Calendar size={20} /> Booking Requests
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Owner Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-blue-800 font-bold mb-2">My Vehicles</h3>
                    <p className="text-3xl font-extrabold text-blue-900">{ownerVehicles.length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-purple-800 font-bold mb-2">Total Requests</h3>
                    <p className="text-3xl font-extrabold text-purple-900">{ownerBookings.length}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="text-yellow-800 font-bold mb-2">Pending Requests</h3>
                    <p className="text-3xl font-extrabold text-yellow-900">
                      {ownerBookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Vehicles</h2>
                  <button onClick={() => setActiveTab('add-vehicle')} className="btn-primary flex items-center gap-2 text-sm">
                    <PlusCircle size={16} /> Add New
                  </button>
                </div>
                {ownerVehicles.length === 0 ? (
                  <p className="text-gray-500">You haven't added any vehicles yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ownerVehicles.map(vehicle => (
                      <div key={vehicle._id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                        <div className="h-32 bg-gray-200 relative">
                          <img src={vehicle.images?.[0] || ''} alt={vehicle.vehicleName} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h4 className="font-bold text-lg text-gray-900 mb-1">{vehicle.vehicleName}</h4>
                          <p className="text-gray-500 text-sm mb-3">{vehicle.category}</p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className="font-bold text-primary-dark">₹{vehicle.pricePerDay}/day</span>
                            <button 
                              onClick={() => {
                                setEditingVehicle(vehicle);
                                setVehicleForm({
                                  vehicleName: vehicle.vehicleName || '',
                                  category: vehicle.category || '',
                                  location: vehicle.location || '',
                                  pricePerHour: vehicle.pricePerHour || '',
                                  pricePerDay: vehicle.pricePerDay || '',
                                  description: vehicle.description || ''
                                });
                                setActiveTab('add-vehicle');
                              }}
                              className="text-sm text-blue-600 font-medium hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'owner-bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Requests</h2>
                {ownerBookings.length === 0 ? (
                  <p className="text-gray-500">No booking requests yet.</p>
                ) : (
                  <div className="space-y-4">
                    {ownerBookings.map(booking => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{booking.vehicleId?.vehicleName}</h4>
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                            <p className="font-semibold text-gray-900 mb-1">Customer Details:</p>
                            <p>Name: <span className="font-medium text-gray-800">{booking.userId?.name}</span></p>
                            <p>Email: <span className="font-medium text-gray-800">{booking.userId?.email}</span></p>
                            <p>Phone: <span className="font-medium text-gray-800">{booking.userId?.phone || 'N/A'}</span></p>
                          </div>
                          <p className="text-gray-500 text-sm mt-3 flex items-center gap-4">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                            {booking.startTime && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">
                                Hourly: {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </span>
                            )}
                            {!booking.startTime && !booking.duration && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-bold">Daily Rental</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {booking.status === 'pending' ? (
                            <>
                              <button onClick={() => handleBookingAction(booking._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">Accept</button>
                              <button onClick={() => handleBookingAction(booking._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">Reject</button>
                            </>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'add-vehicle' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                  {editingVehicle && (
                    <button 
                      onClick={() => {
                        setEditingVehicle(null);
                        setVehicleForm({ vehicleName: '', category: '', location: '', pricePerHour: '', pricePerDay: '', description: '' });
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <form className="space-y-6" onSubmit={async (e) => {
                  e.preventDefault();
                  
                  const formData = new FormData();
                  formData.append('vehicleName', vehicleForm.vehicleName);
                  formData.append('category', vehicleForm.category);
                  formData.append('location', vehicleForm.location);
                  formData.append('pricePerHour', vehicleForm.pricePerHour);
                  formData.append('pricePerDay', vehicleForm.pricePerDay);
                  formData.append('description', vehicleForm.description);
                  
                  selectedFiles.forEach(file => {
                    formData.append('images', file);
                  });

                  try {
                    if (editingVehicle) {
                      await api.put(`/vehicles/${editingVehicle._id}`, formData);
                      toast.success('Vehicle updated successfully!');
                    } else {
                      await api.post('/vehicles', formData);
                      toast.success('Vehicle added successfully!');
                    }
                    fetchOwnerData();
                    setActiveTab('vehicles');
                    setEditingVehicle(null);
                    setVehicleForm({ vehicleName: '', category: '', location: '', pricePerHour: '', pricePerDay: '', description: '' });
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                  } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to save vehicle');
                  }
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name / Model</label>
                      <input type="text" className="input-field" placeholder="e.g. Tata Prima 4028.S" required value={vehicleForm.vehicleName} onChange={(e) => setVehicleForm({...vehicleForm, vehicleName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="input-field" required value={vehicleForm.category} onChange={(e) => setVehicleForm({...vehicleForm, category: e.target.value})}>
                        <option value="">Select Category</option>
                        <option value="Truck">Truck</option>
                        <option value="JCB">JCB</option>
                        <option value="Tractor">Tractor</option>
                        <option value="Dumper">Dumper</option>
                        <option value="Crane">Crane</option>
                        <option value="Trolley">Trolley</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input type="text" className="input-field" placeholder="e.g. Mumbai, Maharashtra" required value={vehicleForm.location} onChange={(e) => setVehicleForm({...vehicleForm, location: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour (₹)</label>
                        <input type="number" className="input-field" placeholder="0" value={vehicleForm.pricePerHour} onChange={(e) => setVehicleForm({...vehicleForm, pricePerHour: e.target.value})} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Day (₹)</label>
                        <input type="number" className="input-field" placeholder="0" required value={vehicleForm.pricePerDay} onChange={(e) => setVehicleForm({...vehicleForm, pricePerDay: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea rows="4" className="input-field" placeholder="Provide details about the condition, specifications, etc." value={vehicleForm.description} onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})}></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Images {editingVehicle && <span className="text-xs font-normal text-gray-500">(Uploading new images will replace existing ones)</span>}
                    </label>
                    <div className="mt-1 flex flex-col gap-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <PlusCircle className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload</p>
                            <p className="text-xs text-gray-400">PNG, JPG or JPEG (Max 5 images)</p>
                          </div>
                          <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                      
                      {(previewUrls.length > 0 || (editingVehicle && editingVehicle.images)) && (
                        <div className="grid grid-cols-5 gap-2">
                          {previewUrls.length > 0 ? (
                            previewUrls.map((url, index) => (
                              <div key={index} className="relative h-20 rounded-md overflow-hidden border border-gray-200">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                              </div>
                            ))
                          ) : editingVehicle?.images?.map((url, index) => (
                            <div key={index} className="relative h-20 rounded-md overflow-hidden border border-gray-200">
                              <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full py-3 mt-4">
                    {editingVehicle ? 'Update Vehicle' : 'Publish Listing'}
                  </button>
                </form>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
