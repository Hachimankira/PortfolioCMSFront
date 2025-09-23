'use client';

import { useForm } from 'react-hook-form';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/lib/types/testimonial.types';
import { useState } from 'react';
import { Quote, User, Briefcase, Building2, Image, Star, ListOrdered, Check, Medal } from 'lucide-react';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSubmit: (data: CreateTestimonialDto | UpdateTestimonialDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  serverErrors: Record<string, string[]> | null;
}

export default function TestimonialForm({
  testimonial,
  onSubmit,
  onCancel,
  loading = false,
  serverErrors,
}: TestimonialFormProps) {
  const [imageError, setImageError] = useState(false);
  const [ratingValue, setRatingValue] = useState<number>(
    testimonial?.rating || 5
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTestimonialDto | UpdateTestimonialDto>({
    defaultValues: testimonial ? {
      // id: testimonial.id,
      content: testimonial.content,
      clientName: testimonial.clientName,
      clientTitle: testimonial.clientTitle || '',
      clientCompany: testimonial.clientCompany || '',
      clientImageUrl: testimonial.clientImageUrl || '',
      rating: testimonial.rating || 5,
      isApproved: testimonial.isApproved,
      isFeatured: testimonial.isFeatured,
      displayOrder: testimonial.displayOrder,
    } : {
      content: '',
      clientName: '',
      clientTitle: '',
      clientCompany: '',
      clientImageUrl: '',
      rating: 5,
      isApproved: false,
      isFeatured: false,
      displayOrder: 0,
    }
  });

  const clientImageUrl = watch('clientImageUrl');
  const content = watch('content');

  const handleRatingChange = (value: number) => {
    setRatingValue(value);
    setValue('rating', value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Testimonial Content */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Quote className="h-5 w-5 mr-2" />
          Testimonial Content
        </h3>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            {...register('content', {
              required: 'Testimonial content is required',
              maxLength: { value: 2000, message: 'Content must be 2000 characters or less' }
            })}
            id="content"
            rows={6}
            className="input-field resize-none"
            placeholder="Enter the testimonial content here..."
          />
          {errors.content && <p className="form-error">{errors.content.message}</p>}
          {serverErrors?.Content && <p className="form-error">{serverErrors?.Content[0]}</p>}

          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              Enter the words of your client or testimonial provider
            </p>
            <span className="text-xs text-gray-400">
              {content?.length || 0}/2000
            </span>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Client Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16">
              {clientImageUrl && !imageError ? (
                <img
                  src={clientImageUrl}
                  alt="Client"
                  className="h-16 w-16 rounded-full object-cover bg-gray-50 border border-gray-200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="clientImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Client Image URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('clientImageUrl', {
                    maxLength: { value: 255, message: 'URL must be 255 characters or less' },
                    pattern: {
                      value: /^(http|https):\/\/[^ "]+$/,
                      message: 'Must be a valid URL'
                    }
                  })}
                  type="url"
                  id="clientImageUrl"
                  className="input-field pl-10"
                  placeholder="https://example.com/client-image.jpg"
                  onChange={() => setImageError(false)}
                />
              </div>
              {errors.clientImageUrl && <p className="form-error">{errors.clientImageUrl.message}</p>}
              {serverErrors?.ClientImageUrl && <p className="form-error">{serverErrors?.ClientImageUrl[0]}</p>}

              <p className="text-sm text-gray-500 mt-1">
                Optional: Add a photo of the person providing the testimonial
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('clientName', {
                  required: 'Client name is required',
                  maxLength: { value: 100, message: 'Name must be 100 characters or less' }
                })}
                type="text"
                id="clientName"
                className="input-field pl-10"
                placeholder="e.g. John Smith"
              />
            </div>
            {errors.clientName && <p className="form-error">{errors.clientName.message}</p>}
            {serverErrors?.ClientName && <p className="form-error">{serverErrors?.ClientName[0]}</p>}

          </div>

          <div>
            <label htmlFor="clientTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Client Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('clientTitle', {
                  maxLength: { value: 100, message: 'Title must be 100 characters or less' }
                })}
                type="text"
                id="clientTitle"
                className="input-field pl-10"
                placeholder="e.g. CEO, Project Manager"
              />
            </div>
            {errors.clientTitle && <p className="form-error">{errors.clientTitle.message}</p>}
            {serverErrors?.ClientTitle && <p className="form-error">{serverErrors?.ClientTitle[0]}</p>}

          </div>

          <div>
            <label htmlFor="clientCompany" className="block text-sm font-medium text-gray-700 mb-2">
              Client Company
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('clientCompany', {
                  maxLength: { value: 100, message: 'Company name must be 100 characters or less' }
                })}
                type="text"
                id="clientCompany"
                className="input-field pl-10"
                placeholder="e.g. Acme Inc."
              />
            </div>
            {errors.clientCompany && <p className="form-error">{errors.clientCompany.message}</p>}
            {serverErrors?.ClientCompany && <p className="form-error">{serverErrors?.ClientCompany[0]}</p>}

          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5)
            </label>
            <div className="mt-1">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('rating')} />
              <p className="text-sm text-gray-500 mt-1">
                How would they rate your work or service?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center">
              <input
                {...register('isApproved')}
                type="checkbox"
                id="isApproved"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isApproved" className="ml-2 block text-sm text-gray-700">
                Approve this testimonial
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Only approved testimonials will be displayed on your portfolio
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <input
                {...register('isFeatured')}
                type="checkbox"
                id="isFeatured"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                Feature this testimonial
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Featured testimonials will be highlighted on your portfolio
            </p>
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
          {loading ? 'Saving...' : testimonial ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
}