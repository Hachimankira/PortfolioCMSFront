'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Profile, UpdateProfileDto } from '@/lib/types/profile.types';
import { profileService } from '@/lib/services/profile.service';
import ProfilePreview from '@/app/components/profile/ProfilePreview';
import { Eye, Edit } from 'lucide-react';
import ProfileForm from '@/app/components/profile/ProfileForm';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileDto) => {
    try {
      setSubmitting(true);
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to update profile');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load profile</h3>
        <p className="text-gray-500 mb-4">There was an error loading your profile information.</p>
        <button
          onClick={fetchProfile}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
          <p className="mt-1 text-gray-600">
            Manage your personal information and professional details
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              showPreview
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showPreview ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {showPreview ? (
        <ProfilePreview profile={profile} />
      ) : (
        <ProfileForm
          profile={profile}
          onSubmit={handleUpdateProfile}
          loading={submitting}
        />
      )}

      {/* Quick Stats */}
      {!showPreview && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {profile.fullName ? '✓' : '○'}
            </div>
            <h3 className="text-sm font-medium text-gray-900">Full Name</h3>
            <p className="text-xs text-gray-500 mt-1">
              {profile.fullName ? 'Completed' : 'Add your full name'}
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {profile.headline ? '✓' : '○'}
            </div>
            <h3 className="text-sm font-medium text-gray-900">Professional Headline</h3>
            <p className="text-xs text-gray-500 mt-1">
              {profile.headline ? 'Completed' : 'Add your professional title'}
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {profile.summary ? '✓' : '○'}
            </div>
            <h3 className="text-sm font-medium text-gray-900">Professional Summary</h3>
            <p className="text-xs text-gray-500 mt-1">
              {profile.summary ? 'Completed' : 'Add your professional summary'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}