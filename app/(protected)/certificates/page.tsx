'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Certificate, CreateCertificateDto, UpdateCertificateDto } from '@/lib/types/certificate.types';
import { certificateService } from '@/lib/services/certificate.service';
import CertificateList from '@/app/components/certificate/CertificateList';
import CertificateForm from '@/app/components/certificate/CertificateForm';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await certificateService.getAll();
      setCertificates(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateCertificateDto | UpdateCertificateDto) => {
    // Ensure required fields for CreateCertificateDto are present
    if (
      typeof data.title !== 'string' ||
      typeof data.issuer !== 'string' ||
      typeof data.displayOrder !== 'number'
    ) {
      toast.error('Invalid data for creating certificate');
      return;
    }
    try {
      setSubmitting(true);
      const newCertificate = await certificateService.create(data as CreateCertificateDto);
      setCertificates(prev => [...prev, newCertificate].sort((a, b) => a.displayOrder - b.displayOrder));
      setShowForm(false);
      toast.success('Certificate created successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to create certificate');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateCertificateDto) => {
    if (!editingCertificate) return;
    
    try {
      setSubmitting(true);
      const updatedCertificate = await certificateService.update(editingCertificate.id, data);
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === editingCertificate.id ? updatedCertificate : cert
        ).sort((a, b) => a.displayOrder - b.displayOrder)
      );
      setEditingCertificate(null);
      setShowForm(false);
      toast.success('Certificate updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Failed to update certificate');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await certificateService.delete(id);
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCertificate(null);
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
          </h1>
        </div>
        
        <div className="card">
          <CertificateForm
            certificate={editingCertificate || undefined}
            onSubmit={editingCertificate ? handleUpdate : handleCreate}
            onCancel={handleCancelForm}
            loading={submitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="mt-1 text-gray-600">
            Manage your professional certifications and credentials
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Certificate
          </button>
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      )}

      <CertificateList
        certificates={filteredCertificates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}