'use client';

import { Profile } from '@/lib/types/profile.types';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ProfilePreviewProps {
  profile: Profile;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Preview</h3>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative">
            {profile.profilePictureUrl && !imageError ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 h-20 w-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                  </div>
                )}
                <img
                  src={profile.profilePictureUrl}
                  alt={profile.fullName || 'Profile'}
                  className="h-20 w-20 rounded-full object-cover border-4 border-primary-200"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onLoadStart={handleImageLoadStart}
                  style={{ opacity: imageLoading ? 0 : 1 }}
                />
              </>
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <User className="h-10 w-10 text-primary-600" />
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.fullName || profile.userName}
          </h2>
          {profile.headline && (
            <p className="text-lg text-primary-600 font-medium mt-1">
              {profile.headline}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
            {profile.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phoneNumber && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{profile.phoneNumber}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {profile.summary && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">About</h4>
          <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Account Details */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Account Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600">Member since:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600">Last updated:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}