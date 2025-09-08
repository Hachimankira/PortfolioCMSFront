import { Profile, UpdateProfileDto } from "@/lib/types/profile.types";
import { Briefcase, Camera, FileText, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProfileFormProps {
    profile: Profile;
    onSubmit: (data: UpdateProfileDto) => Promise<void>;
    loading?: boolean;
}

export default function ProfileForm({ profile, onSubmit, loading = false }: ProfileFormProps) {
    const [imageError, setImageError] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm<UpdateProfileDto>({
        defaultValues: {
            fullName: profile.fullName || '',
            email: profile.email || '',
            phoneNumber: profile.phoneNumber || '',
            profilePictureUrl: profile.profilePictureUrl || '',
            headline: profile.headline || '',
            summary: profile.summary || '',
            location: profile.location || '',
        }
    });

    const profilePictureUrl = watch('profilePictureUrl');

    const handleFormSubmit = async (data: UpdateProfileDto) => {
        const filteredData: UpdateProfileDto = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                filteredData[key as keyof UpdateProfileDto] = value;
            }
        })

        await onSubmit(filteredData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Profile Picture
                </h3>

                <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                        {profilePictureUrl && !imageError ? (
                            <img
                                src={profilePictureUrl}
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture URL
                        </label>
                        <input
                            {...register('profilePictureUrl', {
                                maxLength: { value: 255, message: 'URL must be 255 characters or less' },
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: 'Please enter a valid URL starting with http:// or https://'
                                }
                            })}
                            type="url"
                            id="profilePictureUrl"
                            className="input-field"
                            placeholder="https://example.com/your-photo.jpg"
                            onChange={() => setImageError(false)}
                        />
                        {errors.profilePictureUrl && <p className="form-error">{errors.profilePictureUrl.message}</p>}
                        <p className="text-sm text-gray-500 mt-1">
                            Enter a URL to your profile picture. Recommended size: 400x400px
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            {...register('fullName', {
                                maxLength: { value: 100, message: 'Full name must be 100 characters or less' }
                            })}
                            type="text"
                            id="fullName"
                            className="input-field"
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('email', {
                                    maxLength: { value: 50, message: 'Email must be 50 characters or less' },
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                type="email"
                                id="email"
                                className="input-field pl-10"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('phoneNumber', {
                                    maxLength: { value: 15, message: 'Phone number must be 15 characters or less' }
                                })}
                                type="tel"
                                id="phoneNumber"
                                className="input-field pl-10"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('location', {
                                    maxLength: { value: 100, message: 'Location must be 100 characters or less' }
                                })}
                                type="text"
                                id="location"
                                className="input-field pl-10"
                                placeholder="City, Country"
                            />
                        </div>
                        {errors.location && <p className="form-error">{errors.location.message}</p>}
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Professional Information
                </h3>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Headline
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('headline', {
                                    maxLength: { value: 100, message: 'Headline must be 100 characters or less' }
                                })}
                                type="text"
                                id="headline"
                                className="input-field pl-10"
                                placeholder="e.g. Full Stack Developer | Frontend Developer"
                            />
                        </div>
                        {errors.headline && <p className="form-error">{errors.headline.message}</p>}
                        <p className="text-sm text-gray-500 mt-1">
                            A brief, compelling headline that describes your professional role
                        </p>
                    </div>

                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Summary
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                                {...register('summary', {
                                    maxLength: { value: 1000, message: 'Summary must be 1000 characters or less' }
                                })}
                                id="summary"
                                rows={6}
                                className="input-field pl-10 resize-none"
                                placeholder="Write a compelling summary of your professional background, skills, and career goals..."
                            />
                        </div>
                        {errors.summary && <p className="form-error">{errors.summary.message}</p>}
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500">
                                Describe your professional background and what makes you unique
                            </p>
                            <span className="text-xs text-gray-400">
                                {watch('summary')?.length || 0}/1000
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">User ID:</span>
                        <span className="text-sm text-gray-900 font-mono">{profile.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Username:</span>
                        <span className="text-sm text-gray-900">{profile.userName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Created:</span>
                        <span className="text-sm text-gray-900">
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Last Updated:</span>
                        <span className="text-sm text-gray-900">
                            {new Date(profile.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={loading || !isDirty}
                    className="btn-primary disabled:bg-gray-300 disabled:text-gray-500"
                >
                    {loading ? 'Updating Profile...' : 'Update Profile'}
                </button>
            </div>

            {!isDirty && (
                <p className="text-sm text-gray-500 text-center">
                    Make changes to your profile information to enable the update button
                </p>
            )}
        </form>
    );
}
