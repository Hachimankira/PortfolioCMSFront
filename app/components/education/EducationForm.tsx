'use client';

import { useForm } from 'react-hook-form';
import { Education, CreateEducationDto, UpdateEducationDto } from '@/lib/types/education.types';
import { format } from 'date-fns';
import { GraduationCap, Building2, BookOpen, Calendar, FileText, Camera } from 'lucide-react';
import { useState } from 'react';

interface EducationFormProps {
  education?: Education;
  onSubmit: (data: CreateEducationDto | UpdateEducationDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EducationForm({ 
  education, 
  onSubmit, 
  onCancel, 
  loading = false 
}: EducationFormProps) {
  const [imageError, setImageError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateEducationDto>({
    defaultValues: education ? {
      institution: education.institution,
      degree: education.degree,
      description: education.description || '',
      fieldOfStudy: education.fieldOfStudy || '',
      startDate: format(new Date(education.startDate), 'yyyy-MM-dd'),
      endDate: education.endDate ? format(new Date(education.endDate), 'yyyy-MM-dd') : '',
      isCurrent: education.isCurrent,
      institutionLogoUrl: education.institutionLogoUrl || '',
      displayOrder: education.displayOrder,
    } : {
      institution: '',
      degree: '',
      description: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      institutionLogoUrl: '',
      displayOrder: 0,
    }
  });

  const isCurrent = watch('isCurrent');
  const institutionLogoUrl = watch('institutionLogoUrl');

  const handleFormSubmit = async (data: CreateEducationDto) => {
    const submitData = {
      ...data,
      endDate: data.isCurrent ? undefined : data.endDate,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Institution Logo Section */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Institution Logo
        </h3>
        
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            {institutionLogoUrl && !imageError ? (
              <img
                src={institutionLogoUrl}
                alt="Institution Logo"
                className="h-16 w-16 rounded-lg object-contain bg-gray-50 border border-gray-200"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label htmlFor="institutionLogoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Institution Logo URL
            </label>
            <input
              {...register('institutionLogoUrl', {
                maxLength: { value: 255, message: 'URL must be 255 characters or less' }
              })}
              type="url"
              id="institutionLogoUrl"
              className="input-field"
              placeholder="https://example.com/logo.png"
              onChange={() => setImageError(false)}
            />
            {errors.institutionLogoUrl && <p className="form-error">{errors.institutionLogoUrl.message}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Optional: Add institution logo for better visual presentation
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Education Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
              Institution *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('institution', { 
                  required: 'Institution is required',
                  maxLength: { value: 150, message: 'Institution name must be 150 characters or less' }
                })}
                type="text"
                id="institution"
                className="input-field pl-10"
                placeholder="e.g. University of California"
              />
            </div>
            {errors.institution && <p className="form-error">{errors.institution.message}</p>}
          </div>

          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
              Degree *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('degree', { 
                  required: 'Degree is required',
                  maxLength: { value: 100, message: 'Degree must be 100 characters or less' }
                })}
                type="text"
                id="degree"
                className="input-field pl-10"
                placeholder="e.g. Bachelor of Science"
              />
            </div>
            {errors.degree && <p className="form-error">{errors.degree.message}</p>}
          </div>

          <div>
            <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
              Field of Study
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('fieldOfStudy', {
                  maxLength: { value: 100, message: 'Field of study must be 100 characters or less' }
                })}
                type="text"
                id="fieldOfStudy"
                className="input-field pl-10"
                placeholder="e.g. Computer Science"
              />
            </div>
            {errors.fieldOfStudy && <p className="form-error">{errors.fieldOfStudy.message}</p>}
          </div>

          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              {...register('displayOrder', { 
                valueAsNumber: true,
                min: { value: 0, message: 'Display order must be 0 or greater' }
              })}
              type="number"
              id="displayOrder"
              className="input-field"
              placeholder="0"
            />
            {errors.displayOrder && <p className="form-error">{errors.displayOrder.message}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              {...register('description', {
                maxLength: { value: 1000, message: 'Description must be 1000 characters or less' }
              })}
              id="description"
              rows={4}
              className="input-field pl-10 resize-none"
              placeholder="Describe your educational experience, achievements, coursework, projects, etc..."
            />
          </div>
          {errors.description && <p className="form-error">{errors.description.message}</p>}
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              Optional: Add details about your educational experience
            </p>
            <span className="text-xs text-gray-400">
              {watch('description')?.length || 0}/1000
            </span>
          </div>
        </div>
      </div>

      {/* Duration Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Duration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              {...register('startDate', { required: 'Start date is required' })}
              type="date"
              id="startDate"
              className="input-field"
            />
            {errors.startDate && <p className="form-error">{errors.startDate.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="flex items-center">
                <input
                  {...register('isCurrent')}
                  type="checkbox"
                  id="isCurrent"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                  onChange={(e) => {
                    setValue('isCurrent', e.target.checked);
                    if (e.target.checked) {
                      setValue('endDate', '');
                    }
                  }}
                />
                <label htmlFor="isCurrent" className="text-sm text-gray-700">
                  Currently studying
                </label>
              </div>
            </div>
            
            <input
              {...register('endDate')}
              type="date"
              id="endDate"
              className="input-field"
              disabled={isCurrent}
              placeholder={isCurrent ? "Currently studying" : ""}
            />
            {errors.endDate && <p className="form-error">{errors.endDate.message}</p>}
          </div>
        </div>

        {isCurrent && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="ml-3 text-sm text-green-700">
                This education is marked as currently in progress
              </p>
            </div>
          </div>
        )}
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
          {loading ? 'Saving...' : education ? 'Update Education' : 'Add Education'}
        </button>
      </div>
    </form>
  );
}