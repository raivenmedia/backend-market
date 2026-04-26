import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/api';

export const SellerKYC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await sellerService.getProfile();
      setProfile(response.seller);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-12">Profile not found.</div>;

  // If form is shown, render verification form
  if (showVerificationForm) {
    return (
      <VerificationForm
        profile={profile}
        selectedType={selectedType}
        onClose={() => {
          setShowVerificationForm(false);
          setSelectedType(null);
          fetchProfile();
        }}
      />
    );
  }

  const getVerificationStatus = () => {
    if (profile.verificationStatus === 'verified') {
      return { color: 'green', icon: '✅', text: 'Verified' };
    } else if (profile.verificationStatus === 'pending') {
      return { color: 'yellow', icon: '⏳', text: 'Pending Review' };
    } else if (profile.verificationStatus === 'rejected') {
      return { color: 'red', icon: '❌', text: 'Rejected' };
    } else {
      return { color: 'gray', icon: '⊘', text: 'Not Verified' };
    }
  };

  const status = getVerificationStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Shop Verification</h1>
          <p className="text-gray-600 mt-2">Manage your seller verification status and documents</p>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className={`p-8 rounded-2xl border-2 ${
        status.color === 'green' ? 'bg-green-50 border-green-200' :
        status.color === 'red' ? 'bg-red-50 border-red-200' :
        status.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
        'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-start gap-6">
          <div className={`text-5xl flex-shrink-0 ${
            status.color === 'green' ? 'text-green-600' :
            status.color === 'red' ? 'text-red-600' :
            status.color === 'yellow' ? 'text-yellow-600' :
            'text-gray-600'
          }`}>
            {status.icon}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${
              status.color === 'green' ? 'text-green-900' :
              status.color === 'red' ? 'text-red-900' :
              status.color === 'yellow' ? 'text-yellow-900' :
              'text-gray-900'
            }`}>
              {status.text}
            </h2>
            <p className={`mt-2 ${
              status.color === 'green' ? 'text-green-700' :
              status.color === 'red' ? 'text-red-700' :
              status.color === 'yellow' ? 'text-yellow-700' :
              'text-gray-700'
            }`}>
              {profile.verificationStatus === 'verified'
                ? 'Your shop has been verified. You get a verified badge on all your products, which helps build trust with buyers.'
                : profile.verificationStatus === 'pending'
                ? 'Your verification documents are under review. This usually takes 24-48 hours.'
                : profile.verificationStatus === 'rejected'
                ? 'Your verification was rejected. Please review the requirements and try again with different documents.'
                : 'Verify your shop to build trust with buyers and potentially increase visibility.'}
            </p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Your Business Information</h3>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-semibold text-gray-600">Business Name</dt>
              <dd className="mt-1 text-base text-gray-900">{profile.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600">Business Type</dt>
              <dd className="mt-1 text-base text-gray-900 capitalize">{profile.businessType}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600">Email</dt>
              <dd className="mt-1 text-base text-gray-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600">Phone</dt>
              <dd className="mt-1 text-base text-gray-900">{profile.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-semibold text-gray-600">Address</dt>
              <dd className="mt-1 text-base text-gray-900">
                {profile.location?.address}, {profile.location?.city}, {profile.location?.country}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Verification Documents */}
      {profile.verificationStatus !== 'unverified' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Verification Documents</h3>
          </div>
          <div className="p-6">
            {profile.verificationType === 'business' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Business Permit</p>
                      <p className="text-sm text-gray-600">Uploaded {new Date(profile.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {profile.businessPermit?.url && (
                    <a
                      href={profile.businessPermit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ) : profile.verificationType === 'individual' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">NRC/ID Document</p>
                      <p className="text-sm text-gray-600">Uploaded {new Date(profile.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {profile.nrcDocument?.url && (
                    <a
                      href={profile.nrcDocument.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Action Button */}
      {profile.verificationStatus === 'unverified' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">Ready to get verified?</h3>
              <p className="text-blue-700 mb-4">
                Upload your documents to get verified and display a trust badge on your products. This helps build confidence with buyers.
              </p>
              <button
                onClick={() => setShowVerificationForm(true)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {(profile.verificationStatus === 'rejected' || profile.verificationStatus === 'pending') && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowVerificationForm(true)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Submit Different Documents
          </button>
        </div>
      )}
    </div>
  );
};

// Verification Form Component
const VerificationForm = ({ profile, selectedType, onClose }) => {
  const [verificationType, setVerificationType] = useState(selectedType || '');
  const [address, setAddress] = useState('');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!verificationType) {
      setError('Please select a verification type');
      return;
    }

    if (!document) {
      setError('Please upload a document');
      return;
    }

    if (verificationType === 'individual' && !address.trim()) {
      setError('Please enter your home address');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('verificationType', verificationType);

      if (verificationType === 'business') {
        formData.append('businessPermit', document);
      } else {
        formData.append('nrcDocument', document);
        formData.append('address', address);
      }

      await sellerService.submitKYCVerification(formData);
      alert('Verification documents submitted successfully!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  if (!verificationType) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Verification Type</h2>
          <p className="text-gray-600">Choose how you'd like to verify your shop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setVerificationType('business')}
            className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Business Verification</h3>
            <p className="text-gray-600 text-sm">Upload your business permit or license</p>
          </button>

          <button
            onClick={() => setVerificationType('individual')}
            className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Individual Verification</h3>
            <p className="text-gray-600 text-sm">Upload your NRC/ID and home address</p>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-center w-full text-gray-600 hover:text-gray-900 font-medium py-2"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => setVerificationType('')}
        className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
      >
        ← Back to options
      </button>

      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {verificationType === 'business' ? 'Business Verification' : 'Individual Verification'}
        </h2>
        <p className="text-gray-600 mb-6">
          {verificationType === 'business'
            ? 'Upload your business permit or license document'
            : 'Upload your NRC/ID and provide your home address'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {verificationType === 'individual' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Home Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your home address"
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Upload Document *
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
              {document && <p className="text-sm font-semibold text-green-600 mt-3">Selected: {document.name}</p>}
            </div>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerKYC;
