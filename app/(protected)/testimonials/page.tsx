'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MessageSquareQuote, Filter, CheckCircle, X, Medal, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/lib/types/testimonial.types';
import { testimonialService } from '@/lib/services/testimonial.service';
import TestimonialList from '@/app/components/testimonial/TestimonialList';
import TestimonialForm from '@/app/components/testimonial/TestimonialForm';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all');
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll();
      // Sort by display order
      setTestimonials(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateTestimonialDto | UpdateTestimonialDto) => {
    try {
      setSubmitting(true);
      // Type guard to ensure we have the fields needed for creation
      if (!('id' in data)) {
        const newTestimonial = await testimonialService.create(data as CreateTestimonialDto);
        setTestimonials(prev => [...prev, newTestimonial].sort((a, b) => a.displayOrder - b.displayOrder));
        setServerErrors(null);
        setShowForm(false);
        toast.success('Testimonial added successfully');
      }
    } catch (error: any) {
      const apiMessage = error?.response?.data?.title;
      setServerErrors(error?.response?.data.errors)
      toast.error(apiMessage || 'Failed to add testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateTestimonialDto | CreateTestimonialDto) => {
    if (!editingTestimonial) return;

    try {
      setSubmitting(true);
      // Ensure we have an ID for the update
      const updateData = {
        ...data,
      } as UpdateTestimonialDto;

      await testimonialService.update(editingTestimonial.id, updateData);
      await fetchTestimonials();
      setEditingTestimonial(null);
      setShowForm(false);
      toast.success('Testimonial updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to update testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await testimonialService.delete(id);
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to delete testimonial');
      throw error;
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setServerErrors(null);
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch =
      (testimonial.content && testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (testimonial.clientName && testimonial.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (testimonial.clientTitle && testimonial.clientTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (testimonial.clientCompany && testimonial.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesApproval =
      approvalFilter === 'all' ||
      (approvalFilter === 'approved' && testimonial.isApproved) ||
      (approvalFilter === 'pending' && !testimonial.isApproved);

    const matchesFeatured =
      featuredFilter === 'all' ||
      (featuredFilter === 'featured' && testimonial.isFeatured);

    return matchesSearch && matchesApproval && matchesFeatured;
  });

  // Calculate stats
  const totalCount = testimonials.length;
  const approvedCount = testimonials.filter(t => t.isApproved).length;
  const featuredCount = testimonials.filter(t => t.isFeatured).length;
  const pendingCount = testimonials.filter(t => !t.isApproved).length;

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
    : '0.0';

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquareQuote className="h-7 w-7 mr-3" />
            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h1>
          <p className="mt-1 text-gray-600">
            {editingTestimonial
              ? 'Update testimonial details'
              : 'Add a new client testimonial to your portfolio'
            }
          </p>
        </div>

        <TestimonialForm
          testimonial={editingTestimonial || undefined}
          onSubmit={editingTestimonial ? handleUpdate : handleCreate}
          onCancel={handleCancelForm}
          loading={submitting}
          serverErrors={serverErrors}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquareQuote className="h-7 w-7 mr-3" />
            Testimonials
          </h1>
          <p className="mt-1 text-gray-600">
            Manage client testimonials and reviews
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {testimonials.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Total</h3>
            <p className="mt-1 text-xl font-semibold">{totalCount}</p>
            <p className="text-sm text-gray-600">testimonials</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="mt-1 text-xl font-semibold">{approvedCount}</p>
            <p className="text-sm text-gray-600">visible on site</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="mt-1 text-xl font-semibold">{pendingCount}</p>
            <p className="text-sm text-gray-600">awaiting approval</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Featured</h3>
            <p className="mt-1 text-xl font-semibold">{featuredCount}</p>
            <p className="text-sm text-gray-600">highlighted reviews</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Avg. Rating</h3>
            <p className="mt-1 text-xl font-semibold flex items-center">
              {avgRating}
              <Star className="h-5 w-5 ml-1 text-yellow-400 fill-yellow-400" />
            </p>
            <p className="text-sm text-gray-600">out of 5</p>
          </div>
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircle className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value as 'all' | 'approved' | 'pending')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Medal className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Testimonials</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>
        </div>
      )}

      <TestimonialList
        testimonials={filteredTestimonials}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}