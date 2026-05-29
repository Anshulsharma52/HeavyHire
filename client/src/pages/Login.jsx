import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Truck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard'); // redirect if already logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      setForgotLoading(true);
      await api.post('/auth/forgot-password', { identifier });
      toast.success('OTP generated! Check the server logs/console.');
      setView('reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      setResetLoading(true);
      await api.post('/auth/reset-password', { identifier, otp, newPassword });
      toast.success('Password reset successfully!');
      setView('login');
      setEmail('');
      setPassword('');
      setOtp('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        {view === 'login' && (
          <>
            <div className="text-center">
              <Truck className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link to="/register" className="font-medium text-primary-dark hover:text-primary transition-colors">
                  create a new account
                </Link>
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address or Phone Number
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    className="input-field mt-1"
                    placeholder="you@example.com or +1234567890"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input-field mt-1 pr-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier(email);
                      setView('forgot');
                    }}
                    className="font-medium text-primary-dark hover:text-primary hover:underline transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-dark-darker bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Sign in
                </button>
              </div>
            </form>
          </>
        )}

        {view === 'forgot' && (
          <>
            <div className="text-center">
              <Truck className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Forgot Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your registered email address or phone number to request a 6-digit OTP code.
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleForgotSubmit}>
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Email Address or Phone Number
                </label>
                <input
                  id="identifier"
                  type="text"
                  required
                  className="input-field mt-1"
                  placeholder="you@example.com or +1234567890"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-dark-darker bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                >
                  {forgotLoading ? 'Requesting OTP...' : 'Request OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors mt-2"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </>
        )}

        {view === 'reset' && (
          <>
            <div className="text-center">
              <Truck className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Check your server console/terminal logs for the 6-digit OTP code sent to <span className="font-semibold text-gray-900">{identifier}</span>.
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    6-Digit OTP Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="input-field mt-1 text-center font-mono tracking-widest text-lg"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      className="input-field mt-1 pr-10"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-dark-darker bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                >
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </button>

                <div className="flex justify-between items-center mt-2 px-1">
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs font-medium text-primary-dark hover:text-primary hover:underline transition-colors"
                  >
                    Resend OTP Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-xs font-medium text-gray-500 hover:text-gray-950 hover:underline transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
