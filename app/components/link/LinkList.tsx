'use client';

import { useState } from 'react';
import { Link } from '@/lib/types/link.types';
import { Edit, Trash2, ExternalLink, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LinkListProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function LinkList({ 
  links, 
  onEdit, 
  onDelete, 
  loading = false 
}: LinkListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleDelete = async (id: number, platform: string) => {
    if (window.confirm(`Are you sure you want to delete the ${platform} link?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        toast.success('Link deleted successfully');
      } catch (error) {
        toast.error('Failed to delete link');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  // Get platform color
  const getPlatformColor = (platform: string): string => {
    const platformMap: Record<string, string> = {
      'GitHub': '#171515',
      'LinkedIn': '#0A66C2',
      'Twitter': '#1DA1F2',
      'Facebook': '#1877F2',
      'Instagram': '#E4405F',
      'YouTube': '#FF0000',
      'Medium': '#000000',
      'Dribbble': '#EA4C89',
      'Behance': '#1769FF',
      'Stack Overflow': '#F48024',
      'Dev.to': '#0A0A0A',
    };
    
    return platformMap[platform] || '#6B7280'; // Default gray color
  };

  // Platform icon placeholder
  const getPlatformInitial = (platform: string): string => {
    return platform.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse flex items-center p-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <Link2 className="h-24 w-24" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No social links found</h3>
        <p className="text-gray-500">Add links to your social media profiles and websites</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link) => (
        <div key={link.id} className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center p-4">
            {/* Icon */}
            <div className="flex-shrink-0 mr-4">
              {link.iconUrl && !imageErrors.has(link.id) ? (
                <img
                  src={link.iconUrl}
                  alt={`${link.platform} icon`}
                  className="h-10 w-10 rounded-full object-contain bg-gray-50"
                  onError={() => handleImageError(link.id)}
                />
              ) : (
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: getPlatformColor(link.platform) }}
                >
                  {getPlatformInitial(link.platform)}
                </div>
              )}
            </div>
            
            {/* Link Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{link.platform}</h3>
              <p className="text-xs text-gray-500 truncate">{link.url}</p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                title="Open link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => onEdit(link)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                title="Edit link"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(link.id, link.platform)}
                disabled={deletingId === link.id}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                title="Delete link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center rounded-b-lg">
            <span>Display Order: {link.displayOrder}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${link.iconUrl ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {link.iconUrl ? 'Has Icon' : 'No Icon'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}