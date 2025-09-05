'use client';

import { useState } from 'react';
import { Certificate } from '@/lib/types/certificate.types';
import { format } from 'date-fns';
import { Edit, Trash2, ExternalLink, Calendar, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CertificateListProps {
  certificates: Certificate[];
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function CertificateList({ 
  certificates, 
  onEdit, 
  onDelete, 
  loading = false 
}: CertificateListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        toast.success('Certificate deleted successfully');
      } catch (error) {
        toast.error('Failed to delete certificate');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
        <p className="text-gray-500">Get started by adding your first certificate.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <div key={certificate.id} className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                {certificate.title}
                {certificate.credentialUrl && (
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </h3>
              
              <div className="flex items-center text-gray-600 mb-2">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{certificate.issuer}</span>
              </div>

              <div className="flex items-center text-gray-500 text-sm mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Issued: {format(new Date(certificate.dateIssued), 'MMM dd, yyyy')}
                </span>
                {certificate.expirationDate && !certificate.doesNotExpire && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      Expires: {format(new Date(certificate.expirationDate), 'MMM dd, yyyy')}
                    </span>
                  </>
                )}
                {certificate.doesNotExpire && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-green-600 font-medium">No expiration</span>
                  </>
                )}
              </div>

              {certificate.credentialId && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Credential ID:</span> {certificate.credentialId}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                Order: {certificate.displayOrder}
              </span>
              <button
                onClick={() => onEdit(certificate)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                title="Edit certificate"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(certificate.id, certificate.title)}
                disabled={deletingId === certificate.id}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                title="Delete certificate"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Expiration warning */}
          {certificate.expirationDate && !certificate.doesNotExpire && (
            (() => {
              const expDate = new Date(certificate.expirationDate);
              const today = new Date();
              const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              if (daysUntilExpiry < 0) {
                return (
                  <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">
                    <span className="font-medium">Expired {Math.abs(daysUntilExpiry)} days ago</span>
                  </div>
                );
              } else if (daysUntilExpiry <= 30) {
                return (
                  <div className="flex items-center text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-md">
                    <span className="font-medium">Expires in {daysUntilExpiry} days</span>
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>
      ))}
    </div>
  );
}