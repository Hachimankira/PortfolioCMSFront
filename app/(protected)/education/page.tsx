'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { Education, CreateEducationDto, UpdateEducationDto } from '@/lib/types/education.types';
import EducationList from '@/app/components/education/EducationList';
import EducationForm from '@/app/components/education/EducationForm';
import { EducationService } from '@/lib/services/education.service';

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const data = await EducationService.getAll();
      // Sort by display order and then by start date (most recent first)
      setEducations(data.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch education records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateEducationDto | UpdateEducationDto) => {
    try {
      setSubmitting(true);
      // Ensure data matches CreateEducationDto shape
      const createData: CreateEducationDto = {
        ...data,
        institution: data.institution ?? '',
        degree: data.degree ?? '',
        startDate: data.startDate ?? '',
        endDate: data.endDate ?? '',
        fieldOfStudy: data.fieldOfStudy ?? '',
        description: data.description ?? '',
        displayOrder: data.displayOrder ?? 0,
        isCurrent: data.isCurrent ?? false,
      };
      const newEducation = await EducationService.create(createData);
      setEducations(prev => [...prev, newEducation].sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }));
      setShowForm(false);
      toast.success('Education record created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create education record');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateEducationDto) => {
    if (!editingEducation) return;
    
    try {
      setSubmitting(true);
      const updatedEducation = await EducationService.update(editingEducation.id, data);
      setEducations(prev => 
        prev.map(edu => 
          edu.id === editingEducation.id ? updatedEducation : edu
        ).sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        })
      );
      setEditingEducation(null);
      setShowForm(false);
      toast.success('Education record updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update education record');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await EducationService.delete(id);
      setEducations(prev => prev.filter(edu => edu.id !== id));
      toast.success('Education record deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete education record');
    }
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEducation(null);
  };

  const filteredEducations = educations.filter(edu =>
    edu.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.fieldOfStudy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const currentEducation = educations.find(edu => edu.isCurrent);
  const completedEducation = educations.filter(edu => !edu.isCurrent).length;

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-7 w-7 mr-3" />
            {editingEducation ? 'Edit Education' : 'Add New Education'}
          </h1>
          <p className="mt-1 text-gray-600">
            {editingEducation 
              ? 'Update your educational information' 
              : 'Add your educational background and qualifications'
            }
          </p>
        </div>
        
        <EducationForm
          education={editingEducation || undefined}
          onSubmit={editingEducation ? handleUpdate : handleCreate}
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
            <GraduationCap className="h-7 w-7 mr-3" />
            Education
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your academic background and qualifications
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Education
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {educations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Current Education</h3>
            <p className="mt-1 text-xl font-semibold">
              {currentEducation ? currentEducation.institution : 'None'}
            </p>
            {currentEducation && (
              <p className="text-sm text-gray-600">{currentEducation.degree}</p>
            )}
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Completed Education</h3>
            <p className="mt-1 text-xl font-semibold">{completedEducation}</p>
            <p className="text-sm text-gray-600">programs completed</p>
          </div>
        </div>
      )}

      {educations.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search education..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      )}

      <EducationList
        educations={filteredEducations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}