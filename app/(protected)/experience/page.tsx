'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { Experience, CreateExperienceDto, UpdateExperienceDto, EmploymentType } from '@/lib/types/experience.types';
import { ExperienceService } from '@/lib/services/experience.service';
import ExperienceList from '@/app/components/experience/ExperienceList';
import ExperienceForm from '@/app/components/experience/ExperienceForm';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await ExperienceService.getAll();
      // Sort by display order and then by start date (most recent first)
      setExperiences(data.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }));
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to fetch experience records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateExperienceDto | UpdateExperienceDto) => {
    try {
      setSubmitting(true);
      // Ensure required fields are present for CreateExperienceDto
      if (
        typeof data.company !== 'string' ||
        typeof data.position !== 'string' ||
        typeof data.startDate !== 'string'
      ) {
        toast.error('Missing required fields for creating experience');
        return;
      }
      const submitData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.isCurrent ? undefined : (data.endDate ? new Date(data.endDate).toISOString() : undefined),
      }
      const newExperience = await ExperienceService.create(submitData as CreateExperienceDto);
      setExperiences(prev => [...prev, newExperience].sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }));
      setShowForm(false);
      toast.success('Experience added successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to add experience');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateExperienceDto) => {
    if (!editingExperience) return;

    try {
      setSubmitting(true);
      const submitData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.isCurrent ? undefined : (data.endDate ? new Date(data.endDate).toISOString() : undefined),
      }
      const updatedExperience = await ExperienceService.update(editingExperience.id, submitData);
      setExperiences(prev =>
        prev.map(exp =>
          exp.id === editingExperience.id ? updatedExperience : exp
        ).sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        })
      );
      setEditingExperience(null);
      setShowForm(false);
      toast.success('Experience updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to update experience');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ExperienceService.delete(id);
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      toast.success('Experience deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to delete experience');
      throw error; // Rethrow for the component to handle
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const filteredExperiences = experiences.filter(exp =>
    exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const currentExperiences = experiences.filter(exp => exp.isCurrent);
  const yearsOfExperience = experiences.reduce((total, exp) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return total + years;
  }, 0);

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-7 w-7 mr-3" />
            {editingExperience ? 'Edit Experience' : 'Add New Experience'}
          </h1>
          <p className="mt-1 text-gray-600">
            {editingExperience
              ? 'Update your work experience details'
              : 'Add your professional work experience'
            }
          </p>
        </div>

        <ExperienceForm
          experience={editingExperience || undefined}
          onSubmit={editingExperience ? handleUpdate : handleCreate}
          onCancel={handleCancelForm}
          loading={submitting}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-7 w-7 mr-3" />
            Work Experience
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your professional work history
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Experience
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {experiences.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Current Positions</h3>
            <p className="mt-1 text-xl font-semibold">
              {currentExperiences.length}
            </p>
            <p className="text-sm text-gray-600">active job{currentExperiences.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Experience</h3>
            <p className="mt-1 text-xl font-semibold">
              {Math.floor(yearsOfExperience)} year{Math.floor(yearsOfExperience) !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-600">professional experience</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Experience Records</h3>
            <p className="mt-1 text-xl font-semibold">{experiences.length}</p>
            <p className="text-sm text-gray-600">job{experiences.length !== 1 ? 's' : ''} listed</p>
          </div>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search experience by company, position, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      )}

      <ExperienceList
        experiences={filteredExperiences}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}