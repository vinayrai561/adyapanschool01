'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userTypeParam = searchParams?.get('type');
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up
  const [userType, setUserType] = useState<'students' | 'organizations'>(
    userTypeParam === 'organization' ? 'organizations' : 'students'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Update user type when URL parameter changes
  useEffect(() => {
    if (userTypeParam === 'organization') {
      setUserType('organizations');
    } else if (userTypeParam === 'student') {
      setUserType('students');
    }
  }, [userTypeParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          const role = response.data.user.role;
          router.push(role === 'STUDENT' ? '/dashboard/student' : '/dashboard/company');
        }, 1500);
      } else {
        // Signup
        const signupData = {
          role: userType === 'students' ? 'student' : 'organization',
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          ...(userType === 'students' && {
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
          ...(userType === 'organizations' && {
            fullName: formData.fullName,
            companyName: formData.companyName,
          }),
        };

        const response = await axios.post('/api/auth/signup', signupData);

        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          const role = response.data.user.role;
          router.push(role === 'STUDENT' ? '/dashboard/student' : '/dashboard/company');
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGoogleSignIn = () => {
    // Handle Google authentication logic here
    console.log('Google Sign In clicked for:', userType);
    // You can integrate with Google OAuth here
    // For now, we'll just log the user type
    alert(`Google Sign In for ${userType === 'students' ? 'Students' : 'Organizations'} - Integration needed`);
  };

  return (
    <div className={`min-h-screen flex ${userType === 'organizations' ? 'bg-gradient-to-br from-[#0f1419] via-[#1a2a4e] to-[#0f1419]' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'}`}>
      {/* Left Side - Form */}
      <div className={`flex-1 flex items-center justify-center px-8 py-12 ${userType === 'organizations' ? 'bg-[#0f1419]' : 'bg-white'}`}>
        <div className="w-full max-w-md mt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className={`text-3xl font-bold mb-2 ${userType === 'organizations' ? 'text-white' : 'text-gray-800'}`}>
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className={`text-sm ${userType === 'organizations' ? 'text-gray-400' : 'text-gray-600'}`}>
              {isLogin 
                ? (userType === 'students' ? 'Sign in to continue your learning journey' : 'Sign in to manage your hiring')
                : (userType === 'students' 
                  ? 'Start your journey to learn, earn & get placed'
                  : 'Start hiring skilled, job-ready talent for your organization'
                )
              }
            </p>
          </motion.div>

          {/* User Type Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="students"
                  checked={userType === 'students'}
                  onChange={(e) => setUserType(e.target.value as 'students' | 'organizations')}
                  className="w-4 h-4 text-orange-600 border-gray-600 focus:ring-orange-500"
                />
                <span className={`ml-2 text-sm font-medium ${userType === 'organizations' ? 'text-gray-300' : 'text-gray-700'}`}>For Students</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="organizations"
                  checked={userType === 'organizations'}
                  onChange={(e) => setUserType(e.target.value as 'students' | 'organizations')}
                  className="w-4 h-4 text-orange-600 border-gray-600 focus:ring-orange-500"
                />
                <span className={`ml-2 text-sm font-medium ${userType === 'organizations' ? 'text-gray-300' : 'text-gray-700'}`}>For Organizations</span>
              </label>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-start space-x-3 ${
                  userType === 'organizations'
                    ? 'bg-red-900/20 border border-red-700/50'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${userType === 'organizations' ? 'text-red-400' : 'text-red-600'}`} />
                <p className={`text-sm ${userType === 'organizations' ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-start space-x-3 ${
                  userType === 'organizations'
                    ? 'bg-green-900/20 border border-green-700/50'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${userType === 'organizations' ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`text-sm ${userType === 'organizations' ? 'text-green-300' : 'text-green-700'}`}>{success}</p>
              </motion.div>
            )}

            {/* Name Fields - Only show if not login */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name={userType === 'students' ? 'firstName' : 'fullName'}
                    value={userType === 'students' ? formData.firstName : formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      userType === 'organizations'
                        ? 'border-gray-700 bg-[#1a2a4e] text-white placeholder-gray-500 focus:ring-orange-500'
                        : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-blue-500'
                    }`}
                    placeholder={userType === 'students' ? 'First name' : 'Full name'}
                    required
                  />
                </div>
                {userType === 'students' ? (
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 placeholder-gray-400"
                      placeholder="Last name"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-700 bg-[#1a2a4e] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-white placeholder-gray-500"
                      placeholder="Company name"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  userType === 'organizations'
                    ? 'border-gray-700 bg-[#1a2a4e] text-white placeholder-gray-500 focus:ring-orange-500'
                    : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder={userType === 'students' ? 'Email   Enter your email address' : 'Email   Your work email address'}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  userType === 'organizations'
                    ? 'border-gray-700 bg-[#1a2a4e] text-white placeholder-gray-500 focus:ring-orange-500'
                    : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  userType === 'organizations' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password - Only show if not login */}
            {!isLogin && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                    userType === 'organizations'
                      ? 'border-gray-700 bg-[#1a2a4e] text-white placeholder-gray-500 focus:ring-orange-500'
                      : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    userType === 'organizations' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Forgot Password Link - Only show if login */}
            {isLogin && (
              <div className="text-right">
                <Link href="/auth/forgot-password" className={`text-sm hover:underline ${userType === 'organizations' ? 'text-orange-500' : 'text-orange-600'}`}>
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Checkboxes - Only show if not login */}
            {!isLogin && (
              <div className="space-y-3 pt-2">
                <label className={`flex items-start text-sm ${userType === 'organizations' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <input 
                    type="checkbox" 
                    className={`w-4 h-4 mt-0.5 mr-3 rounded focus:ring-2 ${
                      userType === 'organizations'
                        ? 'text-orange-600 border-gray-700 bg-[#1a2a4e]'
                        : 'text-blue-600 border-gray-300'
                    }`}
                  />
                  {userType === 'students' 
                    ? 'I agree to receive updates, opportunities & career alerts'
                    : 'I agree to receive talent updates and hiring offers'
                  }
                </label>
                <label className={`flex items-start text-sm ${userType === 'organizations' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <input 
                    type="checkbox" 
                    className={`w-4 h-4 mt-0.5 mr-3 rounded focus:ring-2 ${
                      userType === 'organizations'
                        ? 'text-orange-600 border-gray-700 bg-[#1a2a4e]'
                        : 'text-blue-600 border-gray-300'
                    }`}
                    required 
                  />
                  I agree to the <Link href="/terms" className={userType === 'organizations' ? 'text-orange-500 hover:underline' : 'text-blue-600 hover:underline'}>Terms</Link> & <Link href="/privacy" className={userType === 'organizations' ? 'text-orange-500 hover:underline' : 'text-blue-600 hover:underline'}>Privacy Policy</Link>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium text-sm flex items-center justify-center space-x-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? '🔓' : userType === 'students' ? '🚀' : '🎯'}</span>
                  <span>{isLogin ? 'Sign In' : userType === 'students' ? 'Start My Journey' : 'Start Hiring Talent'}</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className={`flex items-center justify-center space-x-3 my-6 ${userType === 'organizations' ? 'border-gray-700' : 'border-gray-300'}`}>
              <div className={`flex-1 border-t ${userType === 'organizations' ? 'border-gray-700' : 'border-gray-300'}`}></div>
              <span className="text-xs font-medium text-gray-500">OR</span>
              <div className={`flex-1 border-t ${userType === 'organizations' ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>

            {/* Google Sign In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleSignIn}
              className={`w-full py-3 border rounded-lg transition-all font-medium text-sm flex items-center justify-center space-x-3 ${
                userType === 'organizations'
                  ? 'border-gray-700 bg-[#1a2a4e] hover:bg-[#2a3a5e] text-gray-300'
                  : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>
                {isLogin 
                  ? 'Sign In with Google'
                  : userType === 'students' 
                    ? 'Continue with Google as Student' 
                    : 'Continue with Google as Organization'
                }
              </span>
            </motion.button>

            {/* Sign In/Up Link */}
            <div className="text-center pt-4">
              <p className={`text-sm ${userType === 'organizations' ? 'text-gray-400' : 'text-gray-600'}`}>
                {isLogin 
                  ? (userType === 'students' ? "Don't have an account?" : "Don't have an account?")
                  : (userType === 'students' ? 'Already have an account?' : 'Already hiring with us?')
                }{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setSuccess(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      fullName: '',
                      companyName: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                  }}
                  className={`hover:underline font-medium ${userType === 'organizations' ? 'text-orange-500' : 'text-orange-600'}`}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Right Side - Image & Features */}
      <div className={`flex-1 flex flex-col justify-center items-center px-8 py-12 relative overflow-hidden ${
        userType === 'organizations'
          ? 'bg-gradient-to-br from-[#1a2a4e] via-[#0f1419] to-[#0f1419]'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        <div className="relative z-10 max-w-lg">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className={`text-4xl font-bold mb-4 leading-tight ${userType === 'organizations' ? 'text-white' : 'text-gray-800'}`}>
              {userType === 'students' ? (
                <>
                  Build Your Future<br />
                  with <span className="text-orange-600">Adyapan</span>
                </>
              ) : (
                <>
                  Hire Smarter with <span className="text-orange-600">Adyapan</span>
                </>
              )}
            </h2>
            <p className={`text-lg mb-8 ${userType === 'organizations' ? 'text-gray-400' : 'text-gray-600'}`}>
              {userType === 'students' 
                ? 'Gain real-world skills, earn while you learn, and unlock placement opportunities — all in one platform.'
                : 'Find, test, and hire skilled talent — faster and smarter than ever.'
              }
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            {isLogin ? (
              // Login features
              userType === 'students' ? [
                'Access your learning dashboard',
                'Track your skill progress',
                'View your credentials',
                'Apply for opportunities',
                'Connect with mentors',
                'Manage your profile'
              ] : [
                'Post micro-internship tasks',
                'Review candidate applications',
                'Manage your hiring pipeline',
                'Track project progress',
                'Rate and review talent',
                'Access analytics'
              ]
            ) : (
              // Signup features
              userType === 'students' ? [
                'Learn Industry-Relevant Skills',
                'Earn While You Learn',
                'Real Internship Experience',
                'Placement Support',
                'AI-Powered Skill Passport',
                'Career Mentorship'
              ] : [
                'Hire Freelancers Instantly',
                'Hire Full-Time Talent',
                'Access Pre-Vetted Candidates',
                'AI-Based Smart Matching',
                'Internship to Full-Time Hiring',
                'Flexible Hiring Options'
              ]
            ).map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className={`font-medium ${userType === 'organizations' ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <img
              src={userType === 'students' 
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0"
                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0"
              }
              alt={userType === 'students' ? "Professional woman with laptop" : "Professional businessman in office"}
              className="w-80 h-64 object-cover rounded-2xl shadow-2xl"
            />
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-2xl">{userType === 'students' ? '📊' : '💼'}</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-2xl">{userType === 'students' ? '🌱' : '🎯'}</span>
            </div>
          </motion.div>
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100" />}>
      <AuthPageContent />
    </Suspense>
  );
}