'use client';

import { useForm } from 'react-hook-form';
import { Link, CreateLinkDto, UpdateLinkDto } from '@/lib/types/link.types';
import { useState } from 'react';
import { LinkIcon, Globe, Image, ListOrdered } from 'lucide-react';

interface LinkFormProps {
  link?: Link;
  onSubmit: (data: CreateLinkDto | UpdateLinkDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  serverErrors?: Record<string, string[]> | null;

}

export default function LinkForm({
  link,
  onSubmit,
  onCancel,
  loading = false,
  serverErrors
}: LinkFormProps) {
  console.log("🚀 ~ LinkForm ~ serverErrors:", serverErrors)
  const [iconError, setIconError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateLinkDto | UpdateLinkDto>({
    defaultValues: link ? {
      // id: link.id,
      platform: link.platform,
      url: link.url,
      iconUrl: link.iconUrl || '',
      displayOrder: link.displayOrder,
    } : {
      platform: '',
      url: '',
      iconUrl: '',
      displayOrder: 0,
    }
  });

  const iconUrl = watch('iconUrl');

  // Popular social platforms with their typical colors
  const popularPlatforms = [
    { name: 'GitHub', color: '#171515', icon: 'github.svg' },
    { name: 'LinkedIn', color: '#0A66C2', icon: 'linkedin.svg' },
    { name: 'Twitter', color: '#1DA1F2', icon: 'twitter.svg' },
    { name: 'Facebook', color: '#1877F2', icon: 'facebook.svg' },
    { name: 'Instagram', color: '#E4405F', icon: 'instagram.svg' },
    { name: 'YouTube', color: '#FF0000', icon: 'youtube.svg' },
    { name: 'Medium', color: '#000000', icon: 'medium.svg' },
    { name: 'Dribbble', color: '#EA4C89', icon: 'dribbble.svg' },
    { name: 'Behance', color: '#1769FF', icon: 'behance.svg' },
    { name: 'Stack Overflow', color: '#F48024', icon: 'stackoverflow.svg' },
    { name: 'Dev.to', color: '#0A0A0A', icon: 'devto.svg' },
    { name: 'Personal Website', color: '#4CAF50', icon: 'website.svg' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Link Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
              Platform *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('platform', {
                  required: 'Platform name is required',
                  maxLength: { value: 50, message: 'Platform name must be 50 characters or less' }
                })}
                type="text"
                id="platform"
                className="input-field pl-10"
                placeholder="e.g. GitHub, LinkedIn, Twitter"
                list="platform-suggestions"
              />
              <datalist id="platform-suggestions">
                {popularPlatforms.map(platform => (
                  <option key={platform.name} value={platform.name} />
                ))}
              </datalist>
            </div>
            {errors.platform && <p className="form-error">{errors.platform.message}</p>}
            {serverErrors?.Platform && <p className="form-error">{serverErrors?.Platform[0]}</p>}
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('url', {
                  required: 'URL is required',
                  maxLength: { value: 500, message: 'URL must be 500 characters or less' },
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: 'Must be a valid URL starting with http:// or https://'
                  }
                })}
                type="url"
                id="url"
                className="input-field pl-10"
                placeholder="https://example.com/your-profile"
              />
            </div>
            {errors.url && <p className="form-error">{errors.url.message}</p>}
            {serverErrors?.Url && <p className="form-error">{serverErrors?.Url[0]}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Icon URL
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12">
                {iconUrl && !iconError ? (
                  <img
                    src={iconUrl}
                    alt="Platform Icon"
                    className="h-12 w-12 rounded-md object-contain bg-gray-50 border border-gray-200"
                    onError={() => setIconError(true)}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('iconUrl', {
                      maxLength: { value: 255, message: 'Icon URL must be 255 characters or less' },
                      pattern: {
                        value: /^(http|https):\/\/[^ "]+$/,
                        message: 'Must be a valid URL starting with http:// or https://'
                      }
                    })}
                    type="url"
                    id="iconUrl"
                    className="input-field pl-10"
                    placeholder="https://example.com/icon.svg"
                    onChange={() => setIconError(false)}
                  />
                </div>
                {errors.iconUrl && <p className="form-error">{errors.iconUrl.message}</p>}
                {serverErrors?.IconUrl && <p className="form-error">{serverErrors?.IconUrl[0]}</p>}

                <p className="text-sm text-gray-500 mt-1">
                  Optional: Add an icon URL for the platform (SVG recommended)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ListOrdered className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('displayOrder', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Display order must be 0 or greater' }
                })}
                type="number"
                id="displayOrder"
                className="input-field pl-10"
                placeholder="0"
              />
            </div>
            {errors.displayOrder && <p className="form-error">{errors.displayOrder.message}</p>}
            {serverErrors?.DisplayOrder && <p className="form-error">{serverErrors?.DisplayOrder[0]}</p>}

            <p className="text-sm text-gray-500 mt-1">
              Lower numbers will display first
            </p>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : link ? 'Update Link' : 'Add Link'}
        </button>
      </div>
    </form>
  );
}