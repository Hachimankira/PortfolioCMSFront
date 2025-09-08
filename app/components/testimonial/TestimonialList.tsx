'use client';

import { useState } from 'react';
import { Testimonial } from '@/lib/types/testimonial.types';
import { Edit, Trash2, Star, User, CheckCircle, Medal } from 'lucide-react';
import toast from 'react-hot-toast';

interface TestimonialListProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function TestimonialList({ 
  testimonials, 
  onEdit, 
  onDelete, 
  loading = false 
}: TestimonialListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleDelete = async (id: number, clientName: string) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from ${clientName}?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        toast.error('Failed to delete testimonial');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
        <p className="text-gray-500">Add testimonials from clients to showcase your reputation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {testimonials.map((testimonial) => (
        <div 
          key={testimonial.id} 
          className={`card hover:shadow-md transition-shadow duration-200 ${
            testimonial.isFeatured ? 'border-yellow-200 bg-yellow-50' : ''
          }`}
        >
          <div className="relative">
            {/* Status badges */}
            <div className="absolute top-0 right-0 flex space-x-2">
              {testimonial.isApproved && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </span>
              )}
              {testimonial.isFeatured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Medal className="h-3 w-3 mr-1" />
                  Featured
                </span>
              )}
            </div>

            {/* Quote marks */}
            <div className="absolute top-4 left-4 text-gray-200 opacity-20">
              <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <div className="p-6">
              {/* Testimonial content */}
              <div className="ml-6 mb-6">
                <p className="text-gray-800 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="flex items-start">
                {/* Client image */}
                <div className="flex-shrink-0 mr-4">
                  {testimonial.clientImageUrl && !imageErrors.has(testimonial.id) ? (
                    <img
                      src={testimonial.clientImageUrl}
                      alt={testimonial.clientName}
                      className="h-12 w-12 rounded-full object-cover"
                      onError={() => handleImageError(testimonial.id)}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Client info */}
                <div>
                  <h4 className="text-base font-medium text-gray-900">{testimonial.clientName}</h4>
                  
                  {(testimonial.clientTitle || testimonial.clientCompany) && (
                    <p className="text-sm text-gray-600">
                      {testimonial.clientTitle}
                      {testimonial.clientTitle && testimonial.clientCompany && ', '}
                      {testimonial.clientCompany}
                    </p>
                  )}
                  
                  {testimonial.rating && (
                    <div className="mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-lg">
              <span className="text-xs text-gray-500">Display Order: {testimonial.displayOrder}</span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(testimonial)}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Edit testimonial"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id, testimonial.clientName)}
                  disabled={deletingId === testimonial.id}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                  title="Delete testimonial"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}