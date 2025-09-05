'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, LayoutGrid, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectStatus } from '@/lib/types/project.types';
import { projectService } from '@/lib/services/project.service';
import ProjectList from '@/app/components/project/ProjectList';
import ProjectForm from '@/app/components/project/ProjectForm';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      // Sort by display order
      setProjects(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateProjectDto) => {
    try {
      setSubmitting(true);
      const newProject = await projectService.create(data);
      setProjects(prev => [...prev, newProject].sort((a, b) => a.displayOrder - b.displayOrder));
      setShowForm(false);
      toast.success('Project created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateProjectDto) => {
    if (!editingProject) return;
    
    try {
      setSubmitting(true);
      const updatedProject = await projectService.update(editingProject.id, data);
      setProjects(prev => 
        prev.map(proj => 
          proj.id === editingProject.id ? updatedProject : proj
        ).sort((a, b) => a.displayOrder - b.displayOrder)
      );
      setEditingProject(null);
      setShowForm(false);
      toast.success('Project updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(proj => proj.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
      throw error;
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         proj.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proj.technologies?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const featuredCount = projects.filter(proj => proj.isFeatured).length;
  const completedCount = projects.filter(proj => proj.status === ProjectStatus.Completed).length;
  const inProgressCount = projects.filter(proj => proj.status === ProjectStatus.InProgress).length;

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LayoutGrid className="h-7 w-7 mr-3" />
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className="mt-1 text-gray-600">
            {editingProject 
              ? 'Update your project details' 
              : 'Add a new project to your portfolio'
            }
          </p>
        </div>
        
        <ProjectForm
          project={editingProject || undefined}
          onSubmit={async (data) => {
            if (editingProject) {
              // Only pass fields defined in UpdateProjectDto
              await handleUpdate(data as UpdateProjectDto);
            } else {
              // Only pass fields defined in CreateProjectDto
              await handleCreate(data as CreateProjectDto);
            }
          }}
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
            <LayoutGrid className="h-7 w-7 mr-3" />
            Projects
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your portfolio projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Featured Projects</h3>
            <p className="mt-1 text-xl font-semibold">{featuredCount}</p>
            <p className="text-sm text-gray-600">showcased on portfolio</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="mt-1 text-xl font-semibold">{completedCount}</p>
            <p className="text-sm text-gray-600">finished projects</p>
          </div>
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="mt-1 text-xl font-semibold">{inProgressCount}</p>
            <p className="text-sm text-gray-600">active projects</p>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter as string}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value={ProjectStatus.InProgress}>In Progress</option>
              <option value={ProjectStatus.Completed}>Completed</option>
              <option value={ProjectStatus.OnHold}>On Hold</option>
              <option value={ProjectStatus.Cancelled}>Cancelled</option>
            </select>
          </div>
        </div>
      )}

      <ProjectList
        projects={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}