'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, CreateLinkDto, UpdateLinkDto } from '@/lib/types/link.types';
import { linkService } from '@/lib/services/link.service';
import LinkList from '@/app/components/link/LinkList';
import LinkForm from '@/app/components/link/LinkForm';

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await linkService.getAll();
      // Sort by display order
      setLinks(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateLinkDto | UpdateLinkDto) => {
    try {
      setSubmitting(true);
      // Type guard to ensure we have the fields needed for creation
      if (!('id' in data)) {
        const newLink = await linkService.create(data as CreateLinkDto);
        setLinks(prev => [...prev, newLink].sort((a, b) => a.displayOrder - b.displayOrder));
        setShowForm(false);
        toast.success('Link added successfully');
      }
    } catch (error: any) {
      console.log("🚀 ~ handleCreate ~ error:", error);
      // Try to get validation errors array or message
      const apiMessage =
        error?.response?.data?.title;
        setErrors(error?.response?.data?.errors);
      console.log("🚀 ~ handleCreate ~ apiMessage:", apiMessage)
      toast.error(apiMessage || 'Failed to add link. Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateLinkDto | CreateLinkDto) => {
    if (!editingLink) return;

    try {
      setSubmitting(true);
      // Ensure we have an ID for the update
      const updateData = {
        ...data,
      } as UpdateLinkDto;

      const updatedLink = await linkService.update(editingLink.id, updateData);
      setLinks(prev =>
        prev.map(link =>
          link.id === editingLink.id ? updatedLink : link
        ).sort((a, b) => a.displayOrder - b.displayOrder)
      );
      setEditingLink(null);
      setShowForm(false);
      toast.success('Link updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update link');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await linkService.delete(id);
      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete link');
      throw error;
    }
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingLink(null);
  };

  const filteredLinks = links.filter(link =>
    link.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Platform counts for stats
  const platformCounts = links.reduce((acc: Record<string, number>, link) => {
    acc[link.platform] = (acc[link.platform] || 0) + 1;
    return acc;
  }, {});

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LinkIcon className="h-7 w-7 mr-3" />
            {editingLink ? 'Edit Social Link' : 'Add New Social Link'}
          </h1>
          <p className="mt-1 text-gray-600">
            {editingLink
              ? 'Update your social media link details'
              : 'Connect your portfolio with your online presence'
            }
          </p>
        </div>

        <LinkForm
          link={editingLink || undefined}
          onSubmit={editingLink ? handleUpdate : handleCreate}
          onCancel={handleCancelForm}
          loading={submitting}
          serverErrors={errors}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LinkIcon className="h-7 w-7 mr-3" />
            Social Links
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your social media and website links
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Link
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {links.length > 0 && (
        <div className="mb-6">
          <div className="card bg-white p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Social Presence</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(platformCounts).map(([platform, count]) => (
                <span key={platform} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {platform} {count > 1 ? `(${count})` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by platform or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      )}

      <LinkList
        links={filteredLinks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}