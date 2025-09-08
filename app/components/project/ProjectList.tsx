'use client';

import { useState } from 'react';
import { Project, ProjectStatus } from '@/lib/types/project.types';
import { Edit, Trash2, ExternalLink, Github, Star, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function ProjectList({ 
  projects, 
  onEdit, 
  onDelete, 
  loading = false 
}: ProjectListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.InProgress:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case ProjectStatus.Completed:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case ProjectStatus.OnHold:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case ProjectStatus.Cancelled:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.InProgress:
        return 'In Progress';
      case ProjectStatus.Completed:
        return 'Completed';
      case ProjectStatus.OnHold:
        return 'On Hold';
      case ProjectStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-500">Get started by adding your first project</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="card hover:shadow-lg transition-shadow duration-200 flex flex-col">
          {/* Featured Image */}
          <div className="relative h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
            {project.featuredImageUrl && !imageErrors.has(project.id) ? (
              <img
                src={project.featuredImageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(project.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Featured Badge */}
            {project.isFeatured && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                {getStatusIcon(project.status)}
                <span className="ml-1">{getStatusText(project.status)}</span>
              </div>
            </div>
            
            {project.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {project.description}
              </p>
            )}
            
            {project.technologies && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.split(',').map((tech, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Project Links */}
            <div className="flex items-center space-x-3 mb-4 mt-auto">
              {project.repoUrl && (
                <a 
                  href={project.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                  title="Repository"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                  title="Live Demo"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-400">Display Order: {project.displayOrder}</span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Edit project"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={deletingId === project.id}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                  title="Delete project"
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