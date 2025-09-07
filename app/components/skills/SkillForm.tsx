'use client';

import { useForm } from 'react-hook-form';
import { Tag, BarChart, ListOrdered } from 'lucide-react';
import { useState } from 'react';
import { CreateSkillDto, Skill, UpdateSkillDto } from '@/lib/types/skills.types';

interface SkillFormProps {
  skill?: Skill;
  onSubmit: (data: CreateSkillDto | UpdateSkillDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function SkillForm({ 
  skill, 
  onSubmit, 
  onCancel, 
  loading = false 
}: SkillFormProps) {
  const [ratingValue, setRatingValue] = useState<number>(
    skill?.level ? parseInt(skill.level) : 7
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateSkillDto>({
    defaultValues: skill ? {
      name: skill.name,
      category: skill.category || '',
      level: skill.level || '7',
      displayOrder: skill.displayOrder,
    } : {
      name: '',
      category: '',
      level: '7',
      displayOrder: 0,
    }
  });

  const skillCategories = [
    'Programming Languages',
    'Frameworks',
    'Libraries',
    'Databases',
    'DevOps',
    'Tools',
    'Design',
    'Frontend',
    'Backend',
    'Mobile',
    'Other'
  ];

  const handleRatingChange = (value: number) => {
    setRatingValue(value);
    setValue('level', value.toString());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skill Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Skill Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('name', { 
                  required: 'Skill name is required',
                  maxLength: { value: 100, message: 'Name must be 100 characters or less' }
                })}
                type="text"
                id="name"
                className="input-field pl-10"
                placeholder="e.g. JavaScript, React, Node.js"
              />
            </div>
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register('category', {
                  maxLength: { value: 50, message: 'Category must be 50 characters or less' }
                })}
                id="category"
                className="input-field pl-10"
              >
                <option value="">Select a category</option>
                {skillCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level (1-10)
            </label>
            <div className="mt-1">
              <input
                type="range"
                min="1"
                max="10"
                value={ratingValue}
                onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-gray-500">Beginner</span>
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-600">{ratingValue}</span>
                  <span className="text-xs text-gray-500">/10</span>
                </div>
                <span className="text-xs text-gray-500">Expert</span>
              </div>
              
              <div className="mt-3 grid grid-cols-10 gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-sm ${i < ratingValue ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onClick={() => handleRatingChange(i + 1)}
                  ></div>
                ))}
              </div>
            </div>
            <input
              type="hidden"
              {...register('level')}
            />
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
          {loading ? 'Saving...' : skill ? 'Update Skill' : 'Add Skill'}
        </button>
      </div>
    </form>
  );
}