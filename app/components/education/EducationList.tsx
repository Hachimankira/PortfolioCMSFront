'use client';

import { useState } from 'react';
import { Education } from '@/lib/types/education.types';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar, Building2, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface EducationListProps {
  educations: Education[];
  onEdit: (education: Education) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function EducationList({ 
  educations, 
  onEdit, 
  onDelete, 
  loading = false 
}: EducationListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleDelete = async (id: number, degree: string, institution: string) => {
    if (window.confirm(`Are you sure you want to delete "${degree} from ${institution}"?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        toast.success('Education deleted successfully');
      } catch (error) {
        toast.error('Failed to delete education');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  const calculateDuration = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (educations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <GraduationCap className="h-24 w-24" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No education found</h3>
        <p className="text-gray-500">Get started by adding your educational background.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map((education) => (
        <div key={education.id} className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4 flex-1">
              {/* Institution Logo */}
              <div className="flex-shrink-0">
                {education.institutionLogoUrl && !imageErrors.has(education.id) ? (
                  <img
                    src={education.institutionLogoUrl}
                    alt={`${education.institution} logo`}
                    className="h-12 w-12 rounded-lg object-contain bg-gray-50 border border-gray-200"
                    onError={() => handleImageError(education.id)}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                )}
              </div>

              {/* Education Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      {education.degree}
                      {education.isCurrent && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                          Current
                        </span>
                      )}
                    </h3>
                    {education.fieldOfStudy && (
                      <div className="flex items-center text-primary-600 text-sm font-medium mt-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{education.fieldOfStudy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">{education.institution}</span>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {education.startDate ? format(new Date(education.startDate), 'MMM yyyy') : 'N/A'} - {' '}
                    {education.isCurrent 
                      ? 'Present' 
                      : education.endDate 
                        ? format(new Date(education.endDate), 'MMM yyyy')
                        : 'Present'
                    }
                  </span>
                  <span className="mx-2">•</span>
                  <span>{calculateDuration(education.startDate ?? '', education.endDate ?? "", education.isCurrent)}</span>
                </div>

                {education.description && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                    {education.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Display Order: {education.displayOrder}</span>
                  <span>Updated: {format(new Date(education.updatedAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(education)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                title="Edit education"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(education.id, education.degree, education.institution)}
                disabled={deletingId === education.id}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                title="Delete education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}