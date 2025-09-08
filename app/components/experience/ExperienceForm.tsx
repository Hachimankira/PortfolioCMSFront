'use client';

import { useForm } from 'react-hook-form';
import { Experience, CreateExperienceDto, UpdateExperienceDto, EmploymentType } from '@/lib/types/experience.types';
import { format } from 'date-fns';
import { Briefcase, Building2, MapPin, Calendar, FileText, Camera } from 'lucide-react';
import { useState } from 'react';

interface ExperienceFormProps {
    experience?: Experience;
    onSubmit: (data: CreateExperienceDto | UpdateExperienceDto) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function ExperienceForm({
    experience,
    onSubmit,
    onCancel,
    loading = false
}: ExperienceFormProps) {
    const [imageError, setImageError] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CreateExperienceDto>({
        defaultValues: experience ? {
            company: experience.company,
            position: experience.position,
            location: experience.location || '',
            employmentType: experience.employmentType,
            startDate: format(new Date(experience.startDate), 'yyyy-MM-dd'),
            endDate: experience.endDate ? format(new Date(experience.endDate), 'yyyy-MM-dd') : '',
            isCurrent: experience.isCurrent,
            description: experience.description || '',
            companyLogoUrl: experience.companyLogoUrl || '',
            displayOrder: experience.displayOrder,
        } : {
            company: '',
            position: '',
            location: '',
            employmentType: EmploymentType.FullTime,
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: '',
            companyLogoUrl: '',
            displayOrder: 0,
        }
    });

    const isCurrent = watch('isCurrent');
    const companyLogoUrl = watch('companyLogoUrl');

    const handleFormSubmit = async (data: CreateExperienceDto) => {
        const submitData = {
            ...data,
            endDate: data.isCurrent ? undefined : data.endDate,
        };
        await onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Company Logo Section */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Company Logo
                </h3>

                <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                        {companyLogoUrl && !imageError ? (
                            <img
                                src={companyLogoUrl}
                                alt="Company Logo"
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
                        <label htmlFor="companyLogoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            Company Logo URL
                        </label>
                        <input
                            {...register('companyLogoUrl', {
                                maxLength: { value: 255, message: 'URL must be 255 characters or less' }
                            })}
                            type="url"
                            id="companyLogoUrl"
                            className="input-field"
                            placeholder="https://example.com/logo.png"
                            onChange={() => setImageError(false)}
                        />
                        {errors.companyLogoUrl && <p className="form-error">{errors.companyLogoUrl.message}</p>}
                        <p className="text-sm text-gray-500 mt-1">
                            Optional: Add company logo for better visual presentation
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Experience Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                            Company *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('company', {
                                    required: 'Company is required',
                                    maxLength: { value: 150, message: 'Company name must be 150 characters or less' }
                                })}
                                type="text"
                                id="company"
                                className="input-field pl-10"
                                placeholder="e.g. Acme Corporation"
                            />
                        </div>
                        {errors.company && <p className="form-error">{errors.company.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                            Position *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('position', {
                                    required: 'Position is required',
                                    maxLength: { value: 100, message: 'Position must be 100 characters or less' }
                                })}
                                type="text"
                                id="position"
                                className="input-field pl-10"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                        {errors.position && <p className="form-error">{errors.position.message}</p>}
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
                                placeholder="e.g. San Francisco, CA"
                            />
                        </div>
                        {errors.location && <p className="form-error">{errors.location.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
                            Employment Type
                        </label>
                        <select
                            {...register('employmentType', {
                                valueAsNumber: true // Important! Convert to number
                            })}
                            id="employmentType"
                            className="input-field"
                        >
                            {Object.entries(EmploymentType)
                                // Filter out the reverse mapping that TypeScript adds
                                .filter(([key]) => isNaN(Number(key)))
                                .map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </option>
                                ))}
                        </select>
                        {errors.employmentType && <p className="form-error">{errors.employmentType.message}</p>}
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
                                maxLength: { value: 2000, message: 'Description must be 2000 characters or less' }
                            })}
                            id="description"
                            rows={4}
                            className="input-field pl-10 resize-none"
                            placeholder="Describe your role, responsibilities, achievements, projects, etc..."
                        />
                    </div>
                    {errors.description && <p className="form-error">{errors.description.message}</p>}
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500">
                            Optional: Add details about your role and achievements
                        </p>
                        <span className="text-xs text-gray-400">
                            {watch('description')?.length || 0}/2000
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
                                    I currently work here
                                </label>
                            </div>
                        </div>

                        <input
                            {...register('endDate')}
                            type="date"
                            id="endDate"
                            className="input-field"
                            disabled={isCurrent}
                            placeholder={isCurrent ? "Present" : ""}
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
                                This position is marked as your current job
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
                    {loading ? 'Saving...' : experience ? 'Update Experience' : 'Add Experience'}
                </button>
            </div>
        </form>
    );
}