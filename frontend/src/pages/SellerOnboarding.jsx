import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const SellerOnboarding = () => {
  const [step, setStep] = useState('form'); // form, success, verify
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'individual',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const response = await sellerService.getProfile();
      if (response.seller) {
        // Seller already exists, redirect to dashboard
        navigate('/seller/dashboard');
      }
    } catch (error) {
      // Profile not found, means they need to onboard
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    if (!formData.country.trim()) {
      setError('Country is required');
      return;
    }

    try {
      setLoading(true);
      const response = await sellerService.register(formData);
      await refreshUser(); // Update user role in context
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create seller profile');
      console.error('Seller registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen - Seller can now start selling
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Seller!</h2>
            <p className="text-gray-600 leading-relaxed">
              Your seller profile has been created successfully. You can now start listing products and earning.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Tip:</span> Verify your shop to build trust with buyers and potentially increase visibility in search results.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setStep('verify')}
              className="w-full py-3 px-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Verify Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verification Options Screen
  if (step === 'verify') {
    return <VerificationOptions onClose={() => setStep('success')} />;
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Seller</h1>
            <p className="text-gray-600">Create your seller profile and start selling today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Business Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your business name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all"
                >
                  <option value="individual">Individual / Sole Trader</option>
                  <option value="company">Registered Company</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">No verification required:</span> You can start selling immediately. Verification is optional and recommended to build trust with buyers.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Creating Profile...' : 'Create Seller Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Verification Options Component
const VerificationOptions = ({ onClose }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    verificationType: '',
    address: '',
  });
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerificationType = (type) => {
    setSelectedOption(type);
    setFormData(prev => ({ ...prev, verificationType: type }));
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedOption === 'business' && !document) {
      setError('Business permit document is required');
      return;
    }

    if (selectedOption === 'individual') {
      if (!document) {
        setError('NRC/ID document is required');
        return;
      }
      if (!formData.address.trim()) {
        setError('Home address is required');
        return;
      }
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('verificationType', selectedOption);

      if (selectedOption === 'business') {
        submitData.append('businessPermit', document);
      } else if (selectedOption === 'individual') {
        submitData.append('nrcDocument', document);
        submitData.append('address', formData.address);
      }

      await sellerService.submitKYCVerification(submitData);
      alert('Verification documents submitted! You will be verified within 24-48 hours.');
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification');
      console.error('KYC error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedOption) {
    // Option Selection Screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify Your Shop</h1>
            <p className="text-gray-600 text-lg">
              Choose how you'd like to verify your seller account to build trust with customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Verification */}
            <button
              onClick={() => handleVerificationType('business')}
              className="bg-white rounded-2xl border border-gray-200 p-8 text-left hover:shadow-lg hover:border-gray-300 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Registered Business</h3>
              <p className="text-gray-600 text-sm mb-4">
                Verify with your business permit or license for company-level verification.
              </p>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Select this
              </div>
            </button>

            {/* Individual Verification */}
            <button
              onClick={() => handleVerificationType('individual')}
              className="bg-white rounded-2xl border border-gray-200 p-8 text-left hover:shadow-lg hover:border-gray-300 transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-4 0l4-4m0 0l-4 4m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Individual Seller</h3>
              <p className="text-gray-600 text-sm mb-4">
                Verify with your NRC/ID and home address for individual seller verification.
              </p>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Select this
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip for now and go to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verification Form
  const isBusinessVerification = selectedOption === 'business';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedOption(null)}
          className="mb-6 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
        >
          ← Back to options
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isBusinessVerification ? 'Business Verification' : 'Individual Verification'}
          </h2>
          <p className="text-gray-600 mb-8">
            {isBusinessVerification
              ? 'Upload your business permit or license'
              : 'Upload your NRC/ID and provide your home address'
            }
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Individual Address Field */}
            {!isBusinessVerification && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Home Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your home address"
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                {isBusinessVerification ? 'Business Permit Document *' : 'NRC/ID Document *'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('doc-upload')?.click()}>
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                {document && (
                  <p className="text-sm font-medium text-green-600 mt-3">Selected: {document.name}</p>
                )}
              </div>
              <input
                id="doc-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;
