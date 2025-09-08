'use client';

import { useForm } from 'react-hook-form';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectStatus } from '@/lib/types/project.types';
import { useState } from 'react';
import { Image, FileText, Link2, Github, Globe, Layers, BarChart } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectDto | UpdateProjectDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProjectForm({ 
  project, 
  onSubmit, 
  onCancel, 
  loading = false 
}: ProjectFormProps) {
  const [imageError, setImageError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateProjectDto>({
    defaultValues: project ? {
      title: project.title,
      description: project.description || '',
      featuredImageUrl: project.featuredImageUrl || '',
      technologies: project.technologies || '',
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || '',
      isFeatured: project.isFeatured,
      status: project.status,
      displayOrder: project.displayOrder,
    } : {
      title: '',
      description: '',
      featuredImageUrl: '',
      technologies: '',
      repoUrl: '',
      liveUrl: '',
      isFeatured: false,
      status: ProjectStatus.Completed,
      displayOrder: 0,
    }
  });

  const featuredImageUrl = watch('featuredImageUrl');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Featured Image Section */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Image className="h-5 w-5 mr-2" />
          Featured Image
        </h3>
        
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            {featuredImageUrl && !imageError ? (
              <img
                src={featuredImageUrl}
                alt="Project Preview"
                className="h-24 w-40 rounded-lg object-cover bg-gray-50 border border-gray-200"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-24 w-40 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label htmlFor="featuredImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              {...register('featuredImageUrl', {
                maxLength: { value: 255, message: 'URL must be 255 characters or less' },
                pattern: {
                  value: /^(http|https):\/\/[^ "]+$/,
                  message: 'Must be a valid URL'
                }
              })}
              type="url"
              id="featuredImageUrl"
              className="input-field"
              placeholder="https://example.com/image.jpg"
              onChange={() => setImageError(false)}
            />
            {errors.featuredImageUrl && <p className="form-error">{errors.featuredImageUrl.message}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Add an image to showcase your project
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Project Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              {...register('title', { 
                required: 'Title is required',
                maxLength: { value: 150, message: 'Title must be 150 characters or less' }
              })}
              type="text"
              id="title"
              className="input-field"
              placeholder="e.g. Portfolio Website"
            />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', {
                maxLength: { value: 2000, message: 'Description must be 2000 characters or less' }
              })}
              id="description"
              rows={4}
              className="input-field resize-none"
              placeholder="Describe your project, its purpose, features, and technologies used..."
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500">
                Provide details about your project
              </p>
              <span className="text-xs text-gray-400">
                {watch('description')?.length || 0}/2000
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
              Technologies
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Layers className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('technologies', {
                  maxLength: { value: 500, message: 'Technologies must be 500 characters or less' }
                })}
                type="text"
                id="technologies"
                className="input-field pl-10"
                placeholder="e.g. React, TypeScript, Node.js"
              />
            </div>
            {errors.technologies && <p className="form-error">{errors.technologies.message}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Comma-separated list of technologies used
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Project Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register('status', { 
                  valueAsNumber: true
                })}
                id="status"
                className="input-field pl-10"
              >
                {Object.entries(ProjectStatus)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </option>
                  ))}
              </select>
            </div>
            {errors.status && <p className="form-error">{errors.status.message}</p>}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Link2 className="h-5 w-5 mr-2" />
          Project Links
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Repository URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('repoUrl', {
                  maxLength: { value: 255, message: 'URL must be 255 characters or less' },
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: 'Must be a valid URL'
                  }
                })}
                type="url"
                id="repoUrl"
                className="input-field pl-10"
                placeholder="https://github.com/username/repo"
              />
            </div>
            {errors.repoUrl && <p className="form-error">{errors.repoUrl.message}</p>}
          </div>

          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Live Demo URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('liveUrl', {
                  maxLength: { value: 255, message: 'URL must be 255 characters or less' },
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: 'Must be a valid URL'
                  }
                })}
                type="url"
                id="liveUrl"
                className="input-field pl-10"
                placeholder="https://yourproject.com"
              />
            </div>
            {errors.liveUrl && <p className="form-error">{errors.liveUrl.message}</p>}
          </div>
        </div>
      </div>

      {/* Options Section */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Additional Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center">
              <input
                {...register('isFeatured')}
                type="checkbox"
                id="isFeatured"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                Feature this project
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Featured projects will be highlighted in your portfolio
            </p>
          </div>

          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order *
            </label>
            <input
              {...register('displayOrder', { 
                required: 'Display order is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Display order must be 0 or greater' }
              })}
              type="number"
              id="displayOrder"
              className="input-field"
              placeholder="0"
            />
            {errors.displayOrder && <p className="form-error">{errors.displayOrder.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
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
          {loading ? 'Saving...' : project ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}